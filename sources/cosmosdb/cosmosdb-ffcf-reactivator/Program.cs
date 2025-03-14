// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System.Net;
using System.Text;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Fluent;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Dapr.Client;
using System.Text.Json;
using cosmosdb_reactivator.Services;

namespace ChangeFeedSample
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var configuration = BuildConfiguration();
            var cosmosClient = BuildCosmosClient(configuration);

            var databaseName = configuration["database"];
            var sourceContainerName = configuration["container"];
            var sourceId = configuration["SOURCE_ID"];
            var changeEventSourceId = $"{databaseName}.{sourceContainerName}";

            var stateStoreName = configuration["StateStore"] ?? "drasi-state";
            var pubSubName = configuration["PubSub"] ?? "drasi-pubsub";
            var cursorKeyName = $"reactivator-cursor:{changeEventSourceId}";

            var daprClient = new DaprClientBuilder()
                .Build();

            var sequenceGenerator = new SequenceGenerator(daprClient, stateStoreName);
            await sequenceGenerator.StartAsync(CancellationToken.None);

            await InitializeContainersAsync(cosmosClient, configuration);
            var container = cosmosClient.GetContainer(databaseName, sourceContainerName);            

            var continuationToken = await daprClient.GetStateAsync<string>(stateStoreName, cursorKeyName);

            var startCursor = ChangeFeedStartFrom.Now();
            if (continuationToken != null)
                startCursor = ChangeFeedStartFrom.ContinuationToken(continuationToken);

            var feedIterator = container.GetChangeFeedStreamIterator(startCursor, ChangeFeedMode.AllVersionsAndDeletes);

            var stateOptions = new StateOptions()
            {
                Concurrency = ConcurrencyMode.LastWrite,
                Consistency = ConsistencyMode.Eventual
            };

            while (feedIterator.HasMoreResults)
            {
                using (ResponseMessage response = await feedIterator.ReadNextAsync())
                {
                    if (response.StatusCode == HttpStatusCode.NotModified)
                    {
                        // No new changes
                        // Capture response.ContinuationToken and break or sleep for some time
                        Console.Write(".");
                        Thread.Sleep(500);
                    }
                    else
                    {
                        try
                        {
                            // Reactivator start time
                            var reactivatorStartTime = DateTime.UtcNow.Ticks * 100;
                            using StreamReader sr = new StreamReader(response.Content);
                            using JsonTextReader jtr = new JsonTextReader(sr);

                            var result = JObject.Load(jtr);

                            var documents = (JArray)result["Documents"] ?? new JArray();
                            Console.WriteLine("\nProcessing {0} source changes...", documents.Count);
                            foreach (var document in documents)
                            {
                                var debChange = FormatDebeziumEvent((JObject)document, changeEventSourceId, configuration["partitionKey"], sequenceGenerator, reactivatorStartTime);
                                await daprClient.PublishEventAsync(pubSubName, sourceId + "-change", new[] { JsonDocument.Parse(debChange.ToString()) });
                            }

                            await daprClient.SaveStateAsync(stateStoreName, cursorKeyName, response.ContinuationToken, stateOptions);                            
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error processing event: {ex.Message}");
                        }
                    }
                }
            }

            await sequenceGenerator.StopAsync(CancellationToken.None);
        }


        private static JObject FormatDebeziumEvent(JObject feedEvent, string changeEventSourceId, string partitionKey, ISequenceGenerator sequenceGenerator, long reactivatorStartTime)
        {
            var result = new JObject();
            var source = feedEvent["current"];
            Console.WriteLine("Source: " + source.ToString(Formatting.Indented));
            var debBefore = new JObject();
            var debAfter = new JObject();
            var debState = debAfter;

            switch (feedEvent["metadata"]["operationType"].Value<string>())
            {
                case "create":
                    result["op"] = "i";
                    break;
                case "replace":
                    result["op"] = "u";
                    break;
                case "delete":
                    result["op"] = "d";
                    source = feedEvent["previous"].Value<JObject>();
                    debState = debBefore;
                    break;
                default:
                    throw new NotSupportedException();
            }            
            
            
            result["schema"] = "";

            var isRelation = (bool)(source["_isEdge"] ?? false);

            var debPayload = new JObject();
            result["payload"] = debPayload;

            var debSource = new JObject();
            debPayload["source"] = debSource;
            debSource["lsn"] = sequenceGenerator.GetNext();
            debSource["ts_ns"] = source["_ts"].Value<long>() * 1_000_000_000;  
            debSource["db"] = changeEventSourceId;
            debSource["table"] = isRelation ? "rel" : "node";

            debPayload["before"] = debBefore;            
            debPayload["after"] = debAfter;

            var debStateLabels = new JArray();
            debState["labels"] = debStateLabels;
            var debStateProps = new JObject();
            debState["properties"] = debStateProps;

            foreach (JProperty child in source.Children())
            {
                if (child.Name == "id")
                {
                    debState["id"] = child.Value;
                }
                else if (child.Name == partitionKey)
                {
                    debStateProps[partitionKey] = child.Value;
                }
                else if (child.Name == "label")
                {
                    debStateLabels.Add(child.Value);
                }
                else if (child.Name.StartsWith("_"))
                {
                    if (isRelation)
                    {
                        if (child.Name == "_vertexId")
                        {
                            debState["startId"] = child.Value;
                        }
                        else if (child.Name == "_sink")
                        {
                            debState["endId"] = child.Value;
                        }
                    }
                }
                else
                {
                    var content = (JArray)child.Value;
                    debStateProps[child.Name] = ((JObject)content[0])["_value"];
                }
            }

            result["reactivatorStart_ns"] = reactivatorStartTime;
            result["reactivatorEnd_ns"] = DateTime.UtcNow.Ticks * 100;
            return result;
        }

        private static async Task InitializeContainersAsync(CosmosClient cosmosClient, IConfiguration configuration)
        {
            string databaseName = configuration["database"];
            string sourceContainerName = configuration["container"];
            //string leaseContainerName = configuration["LeasesContainerName"];

            if (string.IsNullOrEmpty(databaseName) || string.IsNullOrEmpty(sourceContainerName))
                throw new ArgumentNullException("'database' and 'container' settings are required. Verify your configuration.");

            //if (string.IsNullOrEmpty(leaseContainerName))
            //    leaseContainerName = "leases";

            Database database = await cosmosClient.CreateDatabaseIfNotExistsAsync(databaseName);

            await database.CreateContainerIfNotExistsAsync(new ContainerProperties(sourceContainerName, "/" + configuration["partitionKey"]));
            //await database.CreateContainerIfNotExistsAsync(new ContainerProperties(leaseContainerName, "/partitionKey"));
        }

        private static IConfiguration BuildConfiguration()
        {
            return new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
        }

        private static CosmosClient BuildCosmosClient(IConfiguration configuration)
        {
            if (string.IsNullOrEmpty(configuration["accountEndpoint"]))
            {
                throw new ArgumentNullException("Missing 'SourceConnectionString' setting in configuration.");
            }

            return new CosmosClientBuilder(configuration["accountEndpoint"])
                .Build();
        }
    }
}