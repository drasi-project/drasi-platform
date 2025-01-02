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

using Microsoft.AspNetCore.Components;
using System.Net.Http;
using ResultReaction.Services;
using System.Text.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

var builder = WebApplication.CreateBuilder(args);
var configuration = BuildConfiguration();

var queryContainerId = configuration["QueryContainerId"] ?? "default";
var queryConfigPath = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
List<string> queryIds = new List<string>();
foreach (var qpath in Directory.GetFiles(queryConfigPath))
{
	var queryId = Path.GetFileName(qpath);
	queryIds.Add(queryId);
}



builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();


var app = builder.Build();
app.UseRouting();

app.Urls.Add("http://0.0.0.0:8080"); //app

// Adding an endpoint that supports retrieving all results
app.MapGet("/{queryId}", async (string queryId) =>
{
	async IAsyncEnumerable<JsonDocument> GetCurrentResult()
	{
		if (!isValidQueryId(queryId))
		{
			Console.WriteLine("The queryId is not specified in the Reaction config: " + queryId);
			yield break;
		}
		Console.WriteLine("Current Timestamp: " + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
		Console.WriteLine("Retrieving all results for queryId: " + queryId);
		var resultViewClient = app.Services.GetRequiredService<IResultViewClient>();

		await foreach (var item in resultViewClient.GetCurrentResult(queryContainerId, queryId))
		{
			yield return item;
		}

	}

	return GetCurrentResult();
});

// Adding an endpoint that supports retrieving all results, returning only the data field
app.MapGet("/{queryId}/data", async (string queryId) =>
{
	async IAsyncEnumerable<JsonElement> GetCurrentResult()
	{
		if (!isValidQueryId(queryId))
		{
			Console.WriteLine("The queryId is not specified in the Reaction config: " + queryId);
			yield break;
		}
		Console.WriteLine("Current Timestamp: " + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
		Console.WriteLine("Retrieving all results for queryId: " + queryId);
		var resultViewClient = app.Services.GetRequiredService<IResultViewClient>();

		await foreach (var item in resultViewClient.GetCurrentResult(queryContainerId, queryId))
		{
			var element = item.RootElement;
			if (element.TryGetProperty("data", out var data))
			{
				yield return data;
			}
		}
	}

	return GetCurrentResult();
});

// Get a result set at a specific timestamp
app.MapGet("/{queryId}/{ts}", async (string queryId, string ts) =>
{
	async IAsyncEnumerable<JsonDocument> GetCurrentResultAtTimeStamp()
	{
		if (!isValidQueryId(queryId))
		{
			Console.WriteLine("The queryId is not specified in the Reaction config: " + queryId);
			yield break;
		}
		Console.WriteLine("Retrieving result for queryId: " + queryId + " at timestamp: " + ts);
		var resultViewClient = app.Services.GetRequiredService<IResultViewClient>();
		await foreach (var item in resultViewClient.GetCurrentResultAtTimeStamp(queryContainerId, queryId, ts))
		{
			yield return item;
		}
	}

	return GetCurrentResultAtTimeStamp();
});

// Get a result set at a specific timestamp, returning only the data field
app.MapGet("/{queryId}/{ts}/data", async (string queryId, string ts) =>
{
	async IAsyncEnumerable<JsonElement> GetCurrentResultAtTimeStamp()
	{
		if (!isValidQueryId(queryId))
		{
			Console.WriteLine("The queryId is not specified in the Reaction config: " + queryId);
			yield break;
		}
		Console.WriteLine("Retrieving result for queryId: " + queryId + " at timestamp: " + ts);
		var resultViewClient = app.Services.GetRequiredService<IResultViewClient>();
		await foreach (var item in resultViewClient.GetCurrentResultAtTimeStamp(queryContainerId, queryId, ts))
		{
			var element = item.RootElement;
			if (element.TryGetProperty("data", out var data))
			{
				yield return data;
			}
		}
	}

	return GetCurrentResultAtTimeStamp();
});


app.RunAsync();

bool isValidQueryId(string queryId)
{
	return queryIds.Contains(queryId);
}

static IConfiguration BuildConfiguration()
{
	return new ConfigurationBuilder()
		.SetBasePath(Directory.GetCurrentDirectory())
		.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
		.AddEnvironmentVariables()
		.Build();
}
