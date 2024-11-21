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

using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Microsoft.Extensions.Configuration;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Gremlin.Net.Driver;
using Gremlin.Net.Structure.IO.GraphSON;
using Gremlin.Net.Driver.Exceptions;
using System.Net.WebSockets;
using JanusGraph.Net;
using JanusGraph.Net.IO.GraphSON;
using System.Text.Json;

namespace Drasi.Reactions.Gremlin.Services {
    public class GremlinService
    {
        private GremlinServer _gremlinServer;

        private GremlinClient _gremlinClient;

        private string _addedResultCommand;

        private string _updatedResultCommand;

        private string _deletedResultCommand;

        private List<string> _addedResultCommandParamList;

        private List<string> _updatedResultCommandParamList;

        private List<string> _deletedResultCommandParamList;

        private readonly ILogger<GremlinService> _logger;

        public GremlinService(IConfiguration configuration, ILogger<GremlinService> logger)
        {
            var databaseHost = configuration["databaseHost"];
            var databasePort = int.TryParse(configuration["databasePort"], out var port) ? port : 443;
            var databaseEnableSSL = !bool.TryParse(configuration["databaseEnableSSL"], out var enableSSL) || enableSSL;
            
            // if databasehost ends with .gremlin.cosmos.azure.com, set useCosmos to true
            var useCosmos = databaseHost.EndsWith(".gremlin.cosmos.azure.com");

            var password = configuration["gremlinPassword"];
            var username = configuration["gremlinUsername"];

            _logger = logger;
            if (useCosmos) {
                var connectionPoolSettings = new ConnectionPoolSettings()
                {
                    MaxInProcessPerConnection = 10,
                    PoolSize = 30,
                    ReconnectionAttempts = 3,
                    ReconnectionBaseDelay = TimeSpan.FromMilliseconds(500)
                };

                var webSocketConfiguration = new Action<ClientWebSocketOptions>(options =>
                {
                    options.KeepAliveInterval = TimeSpan.FromSeconds(10);
                });
                _gremlinServer = new GremlinServer(databaseHost, databasePort, enableSsl: databaseEnableSSL, username: username, password: password);
                _gremlinClient = new GremlinClient(
                    _gremlinServer,
                    new CustomGraphSON2Reader(),
                    new GraphSON2Writer(),
                    "application/vnd.gremlin-v2.0+json",
                    connectionPoolSettings,
                    webSocketConfiguration);
            } else {
                _gremlinServer = new GremlinServer(databaseHost, databasePort);
                _gremlinClient = new GremlinClient(
                    _gremlinServer,
                    new JanusGraphGraphSONMessageSerializer());
            }
            


            _addedResultCommand = configuration["addedResultCommand"];
            _updatedResultCommand = configuration["updatedResultCommand"];
            _deletedResultCommand = configuration["deletedResultCommand"];


            // Regex used to extract parameters from the Gremlin commands
            // Finds any string starting with @ and ending with a-zA-Z0-9-_. (e.g. @param_1-2.3)
            var paramMatcher = new Regex("@[a-zA-Z0-9-_.]*");


            // Extract the parameters from the Gremlin commands

            _addedResultCommandParamList = new List<string>();
            if (!string.IsNullOrEmpty(_addedResultCommand))
            {
                foreach (Match match in paramMatcher.Matches(_addedResultCommand))
                {
                    var param = match.Value.Substring(1);

                    _logger.LogInformation($"Extracted AddedResultCommand Param: {param}");
                    _addedResultCommandParamList.Add(param);
                }
            }

            _updatedResultCommandParamList = new List<string>();
            if (!string.IsNullOrEmpty(_updatedResultCommand))
            {
                foreach (Match match in paramMatcher.Matches(_updatedResultCommand))
                {
                    var param = match.Value.Substring(1);

                    _logger.LogInformation($"Extracted UpdatedResultCommand Param: {param}");
                    _updatedResultCommandParamList.Add(param);
                }
            }

            _deletedResultCommandParamList = new List<string>();
            if (!string.IsNullOrEmpty(_deletedResultCommand))
            {
                foreach (Match match in paramMatcher.Matches(_deletedResultCommand))
                {
                    var param = match.Value.Substring(1);

                    _logger.LogInformation($"Extracted DeletedResultCommand Param: {param}");
                    _deletedResultCommandParamList.Add(param);
                }
            }
        }

        public void ProcessAddedQueryResults(Dictionary<string, object> res)
        {
            string newCmd = _addedResultCommand;

            foreach (var param in _addedResultCommandParamList)
            {
                newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param, res));
            }
            _logger.LogInformation($"Issuing added result command: {newCmd}");

            var resultSet = SubmitRequest(_gremlinClient, newCmd).Result;
            if (resultSet.Count > 0)
            {
                _logger.LogInformation("Added Command Result:");
                foreach (var r in resultSet)
                {
                    // The vertex results are formed as Dictionaries with a nested dictionary for their properties
                    string output = JsonSerializer.Serialize(r);
                    _logger.LogInformation($"\t{output}");
                }
            }
        }

        public void ProcessUpdatedQueryResults(UpdatedResultElement updatedResult)
        {
            _logger.LogInformation($"Updated Result {updatedResult}");

            string newCmd = _updatedResultCommand;

            foreach (var param in _updatedResultCommandParamList)
            {
                if (param.StartsWith("before"))
                {
                    newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param.Substring(7), updatedResult.Before));
                }
                else if (param.StartsWith("after"))
                {
                    newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param.Substring(6), updatedResult.After));
                }
                else
                {
                    newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param, updatedResult.After));
                }
            }
            _logger.LogInformation($"Issuing updated result command: {newCmd}");

            var resultSet = SubmitRequest(_gremlinClient, newCmd).Result;
            if (resultSet.Count > 0)
            {
                _logger.LogInformation("Updated Command Result:");
                foreach (var r in resultSet)
                {
                    // The vertex results are formed as Dictionaries with a nested dictionary for their properties
                    string output = JsonSerializer.Serialize(r);
                    _logger.LogInformation($"\t{output}");
                }
            }
        }

        public void ProcessDeletedQueryResults(Dictionary<string, object> deletedResults)
        {
            _logger.LogInformation($"Deleted Result {deletedResults}");

            string newCmd = _deletedResultCommand;

            foreach (var param in _deletedResultCommandParamList)
            {
                newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param, deletedResults));
            }
            _logger.LogInformation($"Issuing deleted result command: {newCmd}");

            var resultSet = SubmitRequest(_gremlinClient, newCmd).Result;
            if (resultSet.Count > 0)
            {
                _logger.LogInformation("Deleted Command Result:");
                foreach (var r in resultSet)
                {
                    // The vertex results are formed as Dictionaries with a nested dictionary for their properties
                    string output = JsonSerializer.Serialize(r);
                    _logger.LogInformation($"\t{output}");
                }
            }
        }
        private string ExtractQueryResultValue(string param, Dictionary<string, object> queryResult)
        {
            if (queryResult.TryGetValue(param, out var value))
            {
                _logger.LogInformation($"Adding param: {param} = {value}");
                _logger.LogInformation($"Type: {value.GetType()}");
                switch (value)
                {
                    case string strValue:
                        return strValue;
                    case bool boolValue:
                        return boolValue.ToString().ToLower();
                    case int intValue:
                        return intValue.ToString();
                    case long longValue:
                        return longValue.ToString();
                    case double doubleValue:
                        return doubleValue.ToString();
                    case decimal decimalValue:
                        return decimalValue.ToString();
                    case JsonElement jsonElementValue:
                        return jsonElementValue.ToString();
                    default:
                        throw new InvalidDataException($"Unsupported data type for param: {param}");
                }
            }
            else
            {
                _logger.LogInformation($"Missing param: {param}");
                throw new InvalidDataException($"Missing param: {param}");
            }
        }

        private Task<ResultSet<dynamic>> SubmitRequest(GremlinClient gremlinClient, string cmd)
        {
            try
            {
                return gremlinClient.SubmitAsync<dynamic>(cmd);
            }
            catch (ResponseException e)
            {
                _logger.LogInformation("\tRequest Error!");

                // Print the Gremlin status code.
                _logger.LogInformation($"\tStatusCode: {e.StatusCode}");

                // On error, ResponseException.StatusAttributes will include the common StatusAttributes for successful requests, as well as
                // additional attributes for retry handling and diagnostics.
                // These include:
                //  x-ms-retry-after-ms         : The number of milliseconds to wait to retry the operation after an initial operation was throttled. This will be populated when
                //                              : attribute 'x-ms-status-code' returns 429.
                //  x-ms-activity-id            : Represents a unique identifier for the operation. Commonly used for troubleshooting purposes.
                PrintStatusAttributes(e.StatusAttributes);
                _logger.LogInformation($"\t[\"x-ms-retry-after-ms\"] : {GetValueAsString(e.StatusAttributes, "x-ms-retry-after-ms")}");
                _logger.LogInformation($"\t[\"x-ms-activity-id\"] : {GetValueAsString(e.StatusAttributes, "x-ms-activity-id")}");

                throw;
            }
        }

        string GetValueAsString(IReadOnlyDictionary<string, object> dictionary, string key)
        {
            return JsonSerializer.Serialize(GetValueOrDefault(dictionary, key));
        }

        // Print the common StatusAttributes from a ResponseException
        void PrintStatusAttributes(IReadOnlyDictionary<string, object> attributes)
        {
            _logger.LogInformation($"\tStatusAttributes:");
            _logger.LogInformation($"\t[\"x-ms-status-code\"] : {GetValueAsString(attributes, "x-ms-status-code")}");
            _logger.LogInformation($"\t[\"x-ms-total-server-time-ms\"] : {GetValueAsString(attributes, "x-ms-total-server-time-ms")}");
            _logger.LogInformation($"\t[\"x-ms-total-request-charge\"] : {GetValueAsString(attributes, "x-ms-total-request-charge")}");
        }
        object GetValueOrDefault(IReadOnlyDictionary<string, object> dictionary, string key)
        {
            if (dictionary.ContainsKey(key))
            {
                return dictionary[key];
            }

            return null;
        }
    }
}
