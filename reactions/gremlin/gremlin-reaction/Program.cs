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

using Dapr.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Azure;
using Azure.Messaging;
using System.Text.Json;
using Gremlin.Net.Driver;
using Gremlin.Net.Driver.Exceptions;
using Gremlin.Net.Structure.IO.GraphSON;
using System.Net.WebSockets;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

var builder = WebApplication.CreateBuilder(args);
var configuration = BuildConfiguration();

var pubsubName = configuration.GetValue<string>("PubsubName", "drasi-pubsub");
var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");

var databaseHost = configuration.GetValue<string>("DatabaseHost");
var databasePrimaryKey = configuration.GetValue<string>("DatabasePrimaryKey");
var databaseName = configuration.GetValue<string>("DatabaseName");
var databaseContainerName = configuration.GetValue<string>("DatabaseContainerName");
var databaseEnableSSL = configuration.GetValue<bool>("database_connection_ssl", true);
var databasePort = configuration.GetValue<int>("DatabasePort", 443);

var containerLink = $"/dbs/{databaseName}/colls/{databaseContainerName}";
Console.WriteLine($"Connecting to: host: {databaseHost}, port: {databasePort}, container: {containerLink}, ssl: {databaseEnableSSL}");

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

var gremlinServer = new GremlinServer(databaseHost, databasePort, enableSsl: databaseEnableSSL, username: containerLink, password: databasePrimaryKey);
var gremlinClient = new GremlinClient(
    gremlinServer,
    new CustomGraphSON2Reader(),
    new GraphSON2Writer(),
    "application/vnd.gremlin-v2.0+json",
    connectionPoolSettings,
    webSocketConfiguration);


// Regex used to extract parameters from the Gremlin commands
// Finds any string starting with @ and ending with a-zA-Z0-9-_. (e.g. @param_1-2.3)
var paramMatcher = new Regex("@[a-zA-Z0-9-_.]*");

// Process the command to execute for added results
var addedResultCommand = configuration.GetValue<string>("AddedResultCommand", "");
Console.WriteLine($"AddedResultCommand: {addedResultCommand}");
var addedResultCommandParamList = new List<string>();
if(addedResultCommand != "") {
  foreach (Match match in paramMatcher.Matches(addedResultCommand))
  {
      var param = match.Value.Substring(1);

      Console.WriteLine($"Extracted AddedResultCommand Param: {param}");
      addedResultCommandParamList.Add(param);
  }
}

// Process the command to execute for updated results
var updatedResultCommand = configuration.GetValue<string>("UpdatedResultCommand", "");
Console.WriteLine($"UpdatedResultCommand: {updatedResultCommand}");
var updatedResultCommandParamList = new List<string>();
if (updatedResultCommand != "")
{
  foreach (Match match in paramMatcher.Matches(updatedResultCommand))
  {
      var param = match.Value.Substring(1);

      Console.WriteLine($"Extracted UpdatedResultCommand Param: {param}");
      updatedResultCommandParamList.Add(param);
  }
}

// Process the command to execute for deleted results
var deletedResultCommand = configuration.GetValue<string>("DeletedResultCommand", "");
Console.WriteLine($"DeletedResultCommand: {deletedResultCommand}");
var deletedResultCommandParamList = new List<string>();
if (deletedResultCommand != "")
{
  foreach (Match match in paramMatcher.Matches(deletedResultCommand))
  {
      var param = match.Value.Substring(1);

      Console.WriteLine($"Extracted DeletedResultCommand Param: {param}");
      deletedResultCommandParamList.Add(param);
  }
}

builder.Services.AddDaprClient();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors();
app.UseRouting();
app.UseCloudEvents();

app.UseEndpoints(endpoints =>
{
    endpoints.MapSubscribeHandler();
    var ep = endpoints.MapPost("event", ProcessEvent);

    foreach (var qpath in Directory.GetFiles(configDirectory))
    {
        var queryId = Path.GetFileName(qpath);
        ep.WithTopic(pubsubName, queryId + "-results");
    }
});

app.Run("http://0.0.0.0:80");

async Task ProcessEvent(HttpContext context)
{
    try
    {
        var data = await JsonDocument.ParseAsync(context.Request.Body);

        // Console.WriteLine("Got events: " + data.RootElement.GetRawText());
        var evt = data.RootElement;

        
        var queryId = evt.GetProperty("queryId").GetString();
        if (!File.Exists(Path.Combine(configDirectory, queryId)))
        {
            Console.WriteLine("Skipping " + queryId); 
            context.Response.StatusCode = 200;
            return;
        }

        if (evt.GetProperty("kind").GetString() == "change")
        {
            Console.WriteLine("Processing " + queryId);

            var addedResults = evt.GetProperty("addedResults");
            if (addedResultCommand != "" && addedResults.GetArrayLength() > 0)
            {
                ProcessAddedQueryResults(addedResultCommand, addedResultCommandParamList, addedResults);
            }

            var updatedResults = evt.GetProperty("updatedResults");
            if (updatedResultCommand != "" && updatedResults.GetArrayLength() > 0)
            {
                ProcessUpdatedQueryResults(updatedResultCommand, updatedResultCommandParamList, updatedResults);
            }

            var deletedResults = evt.GetProperty("deletedResults");
            if (deletedResultCommand != "" && deletedResults.GetArrayLength() > 0)
            {
                ProcessDeletedQueryResults(deletedResultCommand, deletedResultCommandParamList, deletedResults);
            }    
        }

        context.Response.StatusCode = 200;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error processing event: {ex.Message}");
        throw;
    }
}

void ProcessAddedQueryResults(string addedResultCommand, List<string> addedResultCommandParamList, JsonElement addedResults) {
  Console.WriteLine($"Processing {addedResults.GetArrayLength()} Added Results...");
  foreach (var res in addedResults.EnumerateArray())
  {
      Console.WriteLine($"Added Result {res}");

      string newCmd = addedResultCommand;

      foreach (var param in addedResultCommandParamList)
      {
        newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param, res));
      }
      Console.WriteLine($"Issuing added result command: {newCmd}");

      var resultSet = SubmitRequest(gremlinClient, newCmd).Result;
      if (resultSet.Count > 0)
      {
          Console.WriteLine("Added Command Result:");
          foreach (var r in resultSet)
          {
              // The vertex results are formed as Dictionaries with a nested dictionary for their properties
              string output = JsonConvert.SerializeObject(r);
              Console.WriteLine($"\t{output}");
          }
      }
  }
}

void ProcessUpdatedQueryResults(string updatedResultCommand, List<string> updatedResultCommandParamList, JsonElement updatedResults) {
  Console.WriteLine($"Processing {updatedResults.GetArrayLength()} Updated Results...");
  foreach (var res in updatedResults.EnumerateArray())
  {
    Console.WriteLine($"Updated Result {res}");

    string newCmd = updatedResultCommand;

    foreach (var param in updatedResultCommandParamList)
    {
      if (param.StartsWith("before"))
      {
        newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param.Substring(7), res.GetProperty("before")));
      }
      else if (param.StartsWith("after"))
      {
        newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param.Substring(6), res.GetProperty("after")));
      }
      else
      {
        newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param, res.GetProperty("after")));
      }
    }
    Console.WriteLine($"Issuing updated result command: {newCmd}");

    var resultSet = SubmitRequest(gremlinClient, newCmd).Result;
    if (resultSet.Count > 0)
    {
        Console.WriteLine("Updated Command Result:");
        foreach (var r in resultSet)
        {
            // The vertex results are formed as Dictionaries with a nested dictionary for their properties
            string output = JsonConvert.SerializeObject(r);
            Console.WriteLine($"\t{output}");
        }
    }
  }
}

void ProcessDeletedQueryResults(string deletedResultCommand, List<string> deletedResultCommandParamList, JsonElement deletedResults) {
  Console.WriteLine($"Processing {deletedResults.GetArrayLength()} Deleted Results...");
  foreach (var res in deletedResults.EnumerateArray())
  {
      Console.WriteLine($"Deleted Result {res}");

      string newCmd = deletedResultCommand;

      foreach (var param in deletedResultCommandParamList)
      {
        newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param, res));
      }
      Console.WriteLine($"Issuing deleted result command: {newCmd}");

      var resultSet = SubmitRequest(gremlinClient, newCmd).Result;
      if (resultSet.Count > 0)
      {
          Console.WriteLine("Deleted Command Result:");
          foreach (var r in resultSet)
          {
              // The vertex results are formed as Dictionaries with a nested dictionary for their properties
              string output = JsonConvert.SerializeObject(r);
              Console.WriteLine($"\t{output}");
          }
      }
  }
}

static IConfiguration BuildConfiguration()
{
    return new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
        .AddEnvironmentVariables()
        .Build();
}

static string ExtractQueryResultValue(string param, JsonElement queryResult)
{
    string result = null;

    if (queryResult.TryGetProperty(param, out var value))
    {
        Console.WriteLine($"Adding param: {param} = {value}");

        if (value.ValueKind == JsonValueKind.String)
        {
            result = value.GetString();
        }
        else if (value.ValueKind == JsonValueKind.True)
        {
            result = "true";
        }
        else if (value.ValueKind == JsonValueKind.False)
        {
            result = "false";
        }
        else if (value.ValueKind == JsonValueKind.Number)
        {
            if (value.TryGetInt32(out var intValue))
            {
                result = intValue.ToString();
            }
            else if (value.TryGetInt64(out var longValue))
            {
                result = longValue.ToString();
            }
            else if (value.TryGetDouble(out var doubleValue))
            {
                result = doubleValue.ToString();
            }
            else if (value.TryGetDecimal(out var decimalValue))
            {
                result = decimalValue.ToString();
            }
        }
    }
    else
    {
        Console.WriteLine($"Missing param: {param}");
        throw new InvalidDataException($"Missing param: {param}");
    }
    return result;
}

static Task<ResultSet<dynamic>> SubmitRequest(GremlinClient gremlinClient, string cmd)
{
    try
    {
        return gremlinClient.SubmitAsync<dynamic>(cmd);
    }
    catch (ResponseException e)
    {
        Console.WriteLine("\tRequest Error!");

        // Print the Gremlin status code.
        Console.WriteLine($"\tStatusCode: {e.StatusCode}");

        // On error, ResponseException.StatusAttributes will include the common StatusAttributes for successful requests, as well as
        // additional attributes for retry handling and diagnostics.
        // These include:
        //  x-ms-retry-after-ms         : The number of milliseconds to wait to retry the operation after an initial operation was throttled. This will be populated when
        //                              : attribute 'x-ms-status-code' returns 429.
        //  x-ms-activity-id            : Represents a unique identifier for the operation. Commonly used for troubleshooting purposes.
        PrintStatusAttributes(e.StatusAttributes);
        Console.WriteLine($"\t[\"x-ms-retry-after-ms\"] : {GetValueAsString(e.StatusAttributes, "x-ms-retry-after-ms")}");
        Console.WriteLine($"\t[\"x-ms-activity-id\"] : {GetValueAsString(e.StatusAttributes, "x-ms-activity-id")}");

        throw;
    }
}

static void PrintStatusAttributes(IReadOnlyDictionary<string, object> attributes)
{
    Console.WriteLine($"\tStatusAttributes:");
    Console.WriteLine($"\t[\"x-ms-status-code\"] : {GetValueAsString(attributes, "x-ms-status-code")}");
    Console.WriteLine($"\t[\"x-ms-total-server-time-ms\"] : {GetValueAsString(attributes, "x-ms-total-server-time-ms")}");
    Console.WriteLine($"\t[\"x-ms-total-request-charge\"] : {GetValueAsString(attributes, "x-ms-total-request-charge")}");
}

static string GetValueAsString(IReadOnlyDictionary<string, object> dictionary, string key)
{
    return JsonConvert.SerializeObject(GetValueOrDefault(dictionary, key));
}

static object GetValueOrDefault(IReadOnlyDictionary<string, object> dictionary, string key)
{
    if (dictionary.ContainsKey(key))
    {
        return dictionary[key];
    }

    return null;
}

// This class is required to overcome the limitation that the standard GraphSON2Reader does not support
// deserializing the numeric data returned by Cosmos Gremlin API. 
// Explained here: https://stackoverflow.com/questions/68092798/gremlin-net-deserialize-number-property/72316108#72316108
public class CustomGraphSON2Reader : GraphSON2Reader
{
    public override dynamic ToObject(JsonElement graphSon) =>
      graphSon.ValueKind switch
      {
          // numbers
          JsonValueKind.Number when graphSon.TryGetInt32(out var intValue) => intValue,
          JsonValueKind.Number when graphSon.TryGetInt64(out var longValue) => longValue,
          JsonValueKind.Number when graphSon.TryGetDecimal(out var decimalValue) => decimalValue,

          _ => base.ToObject(graphSon)
      };
}

