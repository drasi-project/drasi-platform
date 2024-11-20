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


using Azure;
using Azure.Identity;
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Services;
using Drasi.Reactions.SignalR.Models.Unpacked;
using Drasi.Reactions.SignalR.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;


var builder = WebApplication.CreateBuilder();
builder.Services.AddTransient<QueryHub>();
builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();
builder.Services.AddSingleton<IManagementClient, ManagementClient>();
builder.Services.AddSingleton<IChangeFormatter, ChangeFormatter>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowCredentials();
            policy.SetIsOriginAllowed(s => true);
            policy.AllowAnyMethod();
            policy.AllowAnyHeader();
        });
});

var azConnStr = Environment.GetEnvironmentVariable("azureSignalRConnectionString");
var signalRBuilder = builder.Services
    .AddSignalR()
    .AddJsonProtocol(cfg => cfg.PayloadSerializerOptions = ModelOptions.JsonOptions);

if (!String.IsNullOrEmpty(azConnStr))
{
    signalRBuilder.AddAzureSignalR(o =>
    {
        o.ConnectionString = azConnStr;
        o.ServerStickyMode = ServerStickyMode.Required;
    });
}
//else
//{
//    Console.WriteLine("Running in stand-alone mode. Please specify an Azure SignalR Service to scale.");
//}

var app = builder.Build();

app.UseCors();
app.UseRouting();
app.MapHub<QueryHub>("/hub");
app.Urls.Add("http://0.0.0.0:8080");




var reaction = new ReactionBuilder()
    .UseChangeEventHandler<ChangeHandler>()
    .UseControlEventHandler<ControlSignalHandler>()
    .ConfigureServices((services) =>
    {
        services.AddSingleton<IChangeFormatter, ChangeFormatter>();
        services.AddTransient(sp => sp.GetRequiredService<IHubContext<QueryHub>>());
    })
    .Build();

await Task.WhenAny(
    reaction.StartAsync(), 
    app.RunAsync()
    );



/*
using Dapr.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using SignalrReaction.Services;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);
var configuration = BuildConfiguration();

var azConnStr = configuration.GetValue<string>("AzureSignalRConnectionString");
var pubsubName = configuration.GetValue<string>("PubsubName", "drasi-pubsub");
var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
var queryContainerId = configuration.GetValue<string>("QueryContainer", "default");

var signalRBuilder = builder.Services
    .AddSignalR()
    .AddNewtonsoftJsonProtocol();

if (!String.IsNullOrEmpty(azConnStr))
{
    signalRBuilder.AddAzureSignalR(o =>
    {
        o.ConnectionString = azConnStr;
        o.ServerStickyMode = ServerStickyMode.Required;
    });
}
else
{
    Console.WriteLine("Running in stand-alone mode. Please specify an Azure SignalR Service to scale.");
}

builder.Services.AddDaprClient();
builder.Services.AddActors(x => { });
builder.Services.AddControllers();
builder.Services.AddTransient(sp => new QueryHub(sp.GetRequiredService<IResultViewClient>(), sp.GetRequiredService<IChangeFormatter>(), queryContainerId));
builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();
builder.Services.AddSingleton<IChangeFormatter, ChangeFormatter>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowCredentials();
            policy.SetIsOriginAllowed(s => true);
            policy.AllowAnyMethod();
            policy.AllowAnyHeader();
        });
});

var app = builder.Build();

app.UseCors();
app.UseRouting();
app.UseCloudEvents();
app.UseEndpoints(endpoints =>
{
    endpoints.MapSubscribeHandler();
    endpoints.MapHub<QueryHub>("/hub"); 
    var ep = endpoints.MapPost("event", ProcessEvent);

    foreach (var qpath in Directory.GetFiles(configDirectory))
    {
        var queryId = Path.GetFileName(qpath);
        ep.WithTopic(pubsubName, queryId + "-results");
    }
});

// TODO: Put SignalR hub and event route on separate ports, add auth to signalr
app.Urls.Add("http://0.0.0.0:80");  //dapr
app.Urls.Add("http://0.0.0.0:8080"); //app
app.Run();


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
        var hubContext = context.RequestServices.GetRequiredService<IHubContext<QueryHub>>();
        var changeFormatter = context.RequestServices.GetRequiredService<IChangeFormatter>();
        var data = await context.Request.ReadAsStringAsync();
        Console.WriteLine("Got events: " + data);
        var evt = JsonConvert.DeserializeObject<JObject>(data);
        
        var kind = evt.Value<string>("kind");        
        var queryId = evt.Value<string>("queryId");
        var sequence = evt.Value<ulong>("sequence");
        var timestamp = evt.Value<ulong>("sourceTimeMs");
        
        var results = new List<JObject>();

        if (kind == "change")
        {
            results.AddRange(changeFormatter.FormatDelete(queryId, sequence, timestamp, evt["deletedResults"].AsEnumerable()));
            results.AddRange(changeFormatter.FormatAdd(queryId, sequence, timestamp, evt["addedResults"].AsEnumerable()));
            results.AddRange(changeFormatter.FormatUpdate(queryId, sequence, timestamp, evt["updatedResults"].AsEnumerable()));
        }

        if (kind == "control")
        {
            results.Add(changeFormatter.FormatControlSignal(queryId, sequence, timestamp, evt["controlSignal"]));
        }

        foreach (var result in results)
        {   
            await hubContext.Clients.Group("_noGroupSubscription_").SendAsync(queryId, result);
            await hubContext.Clients.Group(queryId).SendAsync(queryId, result);
        }

        context.Response.StatusCode = 200;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error sending update: {ex.Message}");
        throw;
    }
}
*/