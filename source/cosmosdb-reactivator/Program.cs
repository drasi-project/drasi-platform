using System.Net;
using System.Text;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Fluent;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Azure.Messaging.EventHubs;
using Azure.Messaging.EventHubs.Producer;

namespace ChangeFeedSample
{
    class Program
    {
        static async Task Main(string[] args)
        {
            IConfiguration configuration = BuildConfiguration();

            CosmosClient cosmosClient = BuildCosmosClient(configuration);

            await InitializeContainersAsync(cosmosClient, configuration);

            string databaseName = configuration["SourceDatabaseName"];
            string sourceContainerName = configuration["SourceContainerName"];
            string eventHubConnectionString = configuration["ChangeEventHubConnectionString"];
            string changeEventSourceId = $"{databaseName}.{sourceContainerName}";
            string eventGridTopic = $"{databaseName}-{sourceContainerName}".ToLower();

            EventHubProducerClient producerClient = new EventHubProducerClient(eventHubConnectionString);

            ChangeFeedRequestOptions options = new ChangeFeedRequestOptions()
            {
                PageSizeHint = 10,
            };

            Container container = cosmosClient.GetContainer(databaseName, sourceContainerName);

            FeedIterator feedIterator = container.GetChangeFeedStreamIterator(
                ChangeFeedStartFrom.Now(),
                ChangeFeedMode.Incremental,
                options);

            while (feedIterator.HasMoreResults)
            {
                using (ResponseMessage response = await feedIterator.ReadNextAsync())
                {
                    if (response.StatusCode == HttpStatusCode.NotModified)
                    {
                        // No new changes
                        // Capture response.ContinuationToken and break or sleep for some time
                        Console.Write(".");
                        Thread.Sleep(2000);
                    }
                    else
                    {
                        using (StreamReader sr = new StreamReader(response.Content))
                        using (JsonTextReader jtr = new JsonTextReader(sr))
                        {
                            JObject result = JObject.Load(jtr);

                            // Console.WriteLine("Source Change: {0}", result);

                            JArray documents = (JArray)result["Documents"] ?? new JArray();
                            Console.WriteLine("\nProcessing {0} source changes...", documents.Count);
                            foreach (var document in documents)
                            {
                                // Console.WriteLine("Source Change: -> {0}", document["id"]);

                                bool isRelation = (bool)(document["_isEdge"] ?? false);

                                JObject debChange = new JObject();

                                debChange["op"] = "i";
                                debChange["ts_ms"] = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                                debChange["schema"] = "";

                                JObject debPayload = new JObject();
                                debChange["payload"] = debPayload;

                                JObject debSource = new JObject();
                                debPayload["source"] = debSource;
                                debSource["ts_sec"] = document["_ts"];
                                debSource["db"] = changeEventSourceId;
                                debSource["table"] = isRelation ? "rel" : "node";

                                debPayload["before"] = new JObject();
                                JObject debAfter = new JObject();
                                debPayload["after"] = debAfter;
                                JArray debAfterLabels = new JArray();
                                debAfter["labels"] = debAfterLabels;
                                JObject debAfterProps = new JObject();
                                debAfter["properties"] = debAfterProps;

                                foreach (JProperty child in document.Children())
                                {
                                    // Console.WriteLine("Child -> {0}, {1}", child.Name, child.Value);
                                    // if (child.Type == JTokenType.Property) {
                                    // var prop = child as JProperty;
                                    // Console.WriteLine("Prop -> {0}, {1}", prop.Name, prop.Value);
                                    // }

                                    if (child.Name == "id")
                                    {
                                        debAfter["id"] = child.Value;
                                    }
                                    else if (child.Name == configuration["SourceContainerPartitionKey"])
                                    {
                                        debAfterProps[configuration["SourceContainerPartitionKey"]] = child.Value;
                                    }
                                    else if (child.Name == "label")
                                    {
                                        debAfterLabels.Add(child.Value);
                                    }
                                    else if (child.Name.StartsWith("_"))
                                    {
                                        if (isRelation)
                                        {
                                            if (child.Name == "_vertexId")
                                            {
                                                debAfter["startId"] = child.Value;
                                            }
                                            else if (child.Name == "_sink")
                                            {
                                                debAfter["endId"] = child.Value;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        JArray content = (JArray)child.Value;
                                        // Console.WriteLine("C NAME -> {0}",child.Name);
                                        // Console.WriteLine("C VALUE -> {0}",((JObject)content[0])["_value"]);

                                        debAfterProps[child.Name] = ((JObject)content[0])["_value"];

                                        // foreach (JObject c in content) {
                                        //     Console.WriteLine("C -> {0}",c);
                                        // }
                                    }
                                }

                                //Console.WriteLine("Change Record -> {0}", debChange);
                                if (debChange["payload"]["source"]["table"].ToString() == "node") {
                                    Console.WriteLine("  {0} node {1}:{2}",
                                        debChange["op"].ToString(),
                                        debChange["payload"]["after"]["id"].ToString(),
                                        debChange["payload"]["after"]["labels"][0].ToString());
                                } else {
                                    Console.WriteLine("  {0} rel {1}--{2}-->{3}",
                                        debChange["op"].ToString(),
                                        debChange["payload"]["after"]["startId"].ToString(),
                                        debChange["payload"]["after"]["labels"][0].ToString(),
                                        debChange["payload"]["after"]["endId"].ToString());
                                }

                                var eventsToSend = new List<EventData>();
                                eventsToSend.Add(new EventData(Encoding.UTF8.GetBytes(debChange.ToString(Formatting.None))));
                                producerClient.SendAsync(eventsToSend);
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Create required containers for the sample.
        /// Change Feed processing requires a source container to read the Change Feed from, and a container to store the state on, called leases.
        /// </summary>
        private static async Task InitializeContainersAsync(
            CosmosClient cosmosClient,
            IConfiguration configuration)
        {
            string databaseName = configuration["SourceDatabaseName"];
            string sourceContainerName = configuration["SourceContainerName"];
            // string leaseContainerName = configuration["LeasesContainerName"];

            if (string.IsNullOrEmpty(databaseName)
                || string.IsNullOrEmpty(sourceContainerName))
                // || string.IsNullOrEmpty(leaseContainerName))
            {
                throw new ArgumentNullException("'SourceDatabaseName' and 'SourceContainerName' settings are required. Verify your configuration.");
            }

            Database database = await cosmosClient.CreateDatabaseIfNotExistsAsync(databaseName);

            await database.CreateContainerIfNotExistsAsync(new ContainerProperties(sourceContainerName, "/" + configuration["SourceContainerPartitionKey"]));

            // await database.CreateContainerIfNotExistsAsync(new ContainerProperties(leaseContainerName, "/partitionKey"));
        }

        private static IConfiguration BuildConfiguration()
        {
            return new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables("RG_")
                .Build();
        }

        private static CosmosClient BuildCosmosClient(IConfiguration configuration)
        {
            if (string.IsNullOrEmpty(configuration["SourceConnectionString"]))
            {
                throw new ArgumentNullException("Missing 'SourceConnectionString' setting in configuration.");
            }

            return new CosmosClientBuilder(configuration["SourceConnectionString"])
                .Build();
        }
    }
}