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
using StorageQueueReaction.Services;
using StorageQueueReaction.Models;
using System.Text.Json;
using System;
using Azure.Storage.Queues;
using Azure.Storage.Queues.Models;

var builder = WebApplication.CreateBuilder(args);
var configuration = BuildConfiguration();

string connectionString = configuration.GetValue<string>("StorageConnectionString");
string queueName = configuration.GetValue<string>("QueueName");
var pubsubName = configuration.GetValue<string>("PubsubName", "drasi-pubsub");
var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");


builder.Services.AddDaprClient();
builder.Services.AddControllers();
builder.Services.AddSingleton<IChangeFormatter, ChangeFormatter>();


var queueServiceClient = new QueueServiceClient(connectionString);
var queueClient = queueServiceClient.GetQueueClient(queueName);

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
        var changeFormatter = context.RequestServices.GetRequiredService<IChangeFormatter>();
        var data = await JsonDocument.ParseAsync(context.Request.Body);

        Console.WriteLine("Got event: " + data.RootElement.GetRawText());

        var evt = data.RootElement;

        var kind = evt.GetProperty("kind").GetString();
        if (kind == "control")
        {
            return;
        }

        if (evt.GetProperty("addedResults").GetArrayLength() == 0 && evt.GetProperty("updatedResults").GetArrayLength() == 0 && evt.GetProperty("deletedResults").GetArrayLength() == 0)
        {
            return;
        }
        await queueClient.SendMessageAsync(data.RootElement.GetRawText());
        context.Response.StatusCode = 200;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error processing event: {ex.Message}");
        throw;
    }
}