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
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.Http;
using EventgridReaction.Services;
using Azure.Messaging.EventGrid;
using Azure;
using Azure.Messaging;
using System.Text.Json;
using EventgridReaction.Models;

var builder = WebApplication.CreateBuilder(args);
var configuration = BuildConfiguration();

var eventGridUri = configuration.GetValue<string>("EventGridUri");
var eventGridKey = configuration.GetValue<string>("EventGridKey");
var pubsubName = configuration.GetValue<string>("PubsubName", "drasi-pubsub");
var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");

var publisherClient = new EventGridPublisherClient(new Uri(eventGridUri), new AzureKeyCredential(eventGridKey));

builder.Services.AddSingleton(publisherClient);
builder.Services.AddDaprClient();
builder.Services.AddControllers();
builder.Services.AddSingleton<IChangeFormatter, ChangeFormatter>();

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

static IConfiguration BuildConfiguration()
{
    return new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
        .AddEnvironmentVariables()
        .Build();
}

async Task ProcessEvent(HttpContext context)
{
    try
    {
        var client = context.RequestServices.GetRequiredService<EventGridPublisherClient>();
        var changeFormatter = context.RequestServices.GetRequiredService<IChangeFormatter>();
        var data = await JsonDocument.ParseAsync(context.Request.Body);

        Console.WriteLine("Got event: " + data.RootElement.GetRawText());

        var evt = data.RootElement;
        if (evt.GetProperty("kind").GetString() == "change")
        {
            var queryId = evt.GetProperty("queryId").GetString();
            if (!File.Exists(Path.Combine(configDirectory, queryId)))
            {
                Console.WriteLine("Skipping " + queryId);
                context.Response.StatusCode = 200;
                return;
            }
            Console.WriteLine("Processing " + queryId);

            var results = new List<ChangeNotification>();

            results.AddRange(changeFormatter.FormatAdd(queryId, evt.GetProperty("addedResults").EnumerateArray()));
            results.AddRange(changeFormatter.FormatUpdate(queryId, evt.GetProperty("updatedResults").EnumerateArray()));
            results.AddRange(changeFormatter.FormatDelete(queryId, evt.GetProperty("deletedResults").EnumerateArray()));

            var resp = await client.SendEventsAsync(results.Select(r => new CloudEvent(queryId, "Drasi.ChangeEvent", r)));
            if (resp.IsError)
            {
                throw new Exception(resp.Content.ToString());
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