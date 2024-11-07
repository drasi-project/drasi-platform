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

using Dapr;
using Dapr.Actors.Client;
using Dapr.Client;
using Microsoft.AspNetCore.Components;
using System.Net.Http;
using Microsoft.Extensions.DependencyInjection;
using ResultReaction.Services;
using System.Text.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

var builder = WebApplication.CreateBuilder(args);
var configuration = BuildConfiguration();

var queryContainerId = configuration["QueryContainerId"] ?? "default";


builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();


var app = builder.Build();
app.UseRouting();

app.Urls.Add("http://0.0.0.0:80");  //dapr
app.Urls.Add("http://0.0.0.0:8080"); //app


// Adding an endpoint that supports retrieving all results
app.MapGet("/{queryId}", async (string queryId) => 
{
    Console.WriteLine("Retrieving result for queryId: " + queryId);
    var resultViewClient = app.Services.GetRequiredService<IResultViewClient>();
    List<JsonElement> result = new List<JsonElement>();
    await foreach (var item in resultViewClient.GetCurrentResult(queryContainerId, queryId))
    {
        var element = item.RootElement;
        if (element.TryGetProperty("data", out var data))
        {
            result.Add(data);
        }
    }
    // Convert result to a string and print it
    Console.WriteLine("Result:" + JsonConvert.SerializeObject(result));
    return result;
});


// Used to get the last result
app.MapGet("/{queryId}/last", async (string queryId) => 
{
    Console.WriteLine("Retrieving the latest result for queryId: " + queryId);
    var resultViewClient = app.Services.GetRequiredService<IResultViewClient>();
    List<JsonElement> result = new List<JsonElement>();
    await foreach (var item in resultViewClient.GetCurrentResult(queryContainerId, queryId))
    {
        var element = item.RootElement;
        if (element.TryGetProperty("data", out var data))
        {
            result.Add(data);
        }
    }
    // Convert result to a string and print it
    Console.WriteLine("Result:" + JsonConvert.SerializeObject(result));
    return result;
});

// Get a result set at a specific timestamp
// Ts is in the format of "2023-04-20T00:00:00"
app.MapGet("/{queryId}/{ts}", async (string queryId, string ts) => 
{
    var resultViewClient = app.Services.GetRequiredService<IResultViewClient>();
    Console.WriteLine("Retrieving result for queryId: " + queryId + " at timestamp: " + ts);
    List<JsonElement> result = new List<JsonElement>();
    await foreach (var item in resultViewClient.GetCurrentResultAtTimeStamp(queryContainerId, queryId,ts))
    {
        var element = item.RootElement;
        if (element.TryGetProperty("data", out var data))
        {
            result.Add(data);
        }
    }
    Console.WriteLine("Result:" + JsonConvert.SerializeObject(result.Last()));
    return result.Last();
});
app.Run();



static IConfiguration BuildConfiguration()
{
    return new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
        .AddEnvironmentVariables()
        .Build();
}
