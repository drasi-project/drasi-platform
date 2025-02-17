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
using Drasi.Reactions.Debug.Server.Models;
using Drasi.Reactions.Debug.Server.Services;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using System.Text;
using System.Net.WebSockets;

var builder = WebApplication.CreateBuilder(args);

var configuration = BuildConfiguration();

var pubsubName = configuration.GetValue<string>("PubsubName", "drasi-pubsub");
var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
var queryContainerId = configuration.GetValue<string>("QueryContainer", "default");


// Add services to the container.
builder.Services.AddDaprClient();
builder.Services.AddActors(x => { });
builder.Services.AddControllers();
builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();
builder.Services.AddSingleton<WebSocketService>();
builder.Services.AddSingleton<IQueryDebugService>(sp => new QueryDebugService(sp.GetRequiredService<IResultViewClient>(), sp.GetRequiredService<IActorProxyFactory>(), sp.GetRequiredService<DaprClient>(), sp.GetRequiredService<WebSocketService>(), configDirectory, queryContainerId));
builder.Services.AddHostedService(sp => sp.GetRequiredService<IQueryDebugService>());

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()   // Allow any origin (change this in production to a specific origin)
                  .AllowAnyMethod()   // Allow any HTTP method (GET, POST, etc.)
                  .AllowAnyHeader();  // Allow any header
        });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseStaticFiles();
app.UseCors("AllowAll");
app.UseRouting();
app.MapControllers();
app.UseCloudEvents();
app.UseWebSockets();

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

// Add a get endpoint
app.MapGet("/query/initialize/{queryId}", async (string queryId, IQueryDebugService debugService) =>
{
    var result = await debugService.GetQueryResult(queryId);
    return Results.Json(result);
});

// Used for reinitializing a query
app.MapGet("/query/reinitialize/{queryId}", async (string queryId, IQueryDebugService debugService) =>
{
    var result = await debugService.ReinitializeQuery(queryId);
    return Results.Json(result);
});

app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/ws/query"))
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            // var queryId = context.Request.Query["queryId"].ToString();
            var pathSegments = context.Request.Path.Value.Split('/');
            var queryId = string.Empty;
            if (pathSegments.Length > 3) // Expected: ["", "ws", "query", "queryId"]
            {
                queryId = pathSegments[3]; // Extract queryId manually
            }

            if (string.IsNullOrEmpty(queryId))
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.InvalidPayloadData, "Invalid queryId", CancellationToken.None);
                return;
            }

            // Add the WebSocket connection to the WebSocket service
            var webSocketService = context.RequestServices.GetRequiredService<WebSocketService>();
            webSocketService.AddConnection(queryId, webSocket);

            // Handle WebSocket connection
            Console.WriteLine($"WebSocket connected for queryId: {queryId}");

            var buffer = new byte[1024 * 4];
            var lastPingTime = DateTime.Now;
            while (webSocket.State == WebSocketState.Open)
            {
                // ... your message handling ...

                // Send a ping every X seconds (e.g., 30 seconds)
                if (DateTime.Now - lastPingTime > TimeSpan.FromSeconds(30))
                {
                    await webSocket.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes("{\"type\": \"ping\"}")), WebSocketMessageType.Text, true, CancellationToken.None);
                    lastPingTime = DateTime.Now;
                }

                await Task.Delay(1000); // Small delay to avoid busy-waiting
            }
        }
        else
        {
            context.Response.StatusCode = 400; // Bad Request if not a WebSocket request
        }
    }
    else
    {
        await next();
    }
});


app.Urls.Add("http://0.0.0.0:5195"); //app
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
        var debugService = context.RequestServices.GetRequiredService<IQueryDebugService>();
        var data = await JsonDocument.ParseAsync(context.Request.Body);

        Console.WriteLine("Got event: " + data.RootElement.GetRawText());

        var evt = data.RootElement;
        var queryId = evt.GetProperty("queryId").GetString();
        if (!File.Exists(Path.Combine(configDirectory, queryId)))
        {
            Console.WriteLine("Skipping " + queryId);
            context.Response.StatusCode = 200;
            return;
        }
        
        switch (evt.GetProperty("kind").GetString()) 
        {
            case "control":
                Console.WriteLine("Processing signal " + queryId);
                await debugService.ProcessControlSignal(evt);
                break;
            case "change":
                Console.WriteLine("Processing change " + queryId);
                await debugService.ProcessRawChange(evt);
                break;
        }        

        context.Response.StatusCode = 200;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error processing event: {ex.Message}");
        throw;
    }
}
// using Dapr.Actors.Client;
// using Dapr.Client;
// using Microsoft.Extensions.Configuration;
// using System.Net.WebSockets;
// using System.Text.Json;
// using System.Text;
// using Drasi.Reactions.Debug.Server.Services;


// var builder = WebApplication.CreateBuilder(args);
// var configuration = BuildConfiguration();
// // Add services to the container.

// builder.Services.AddControllers();

// var pubsubName = configuration.GetValue<string>("PubsubName", "drasi-pubsub");
// var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
// var queryContainerId = configuration.GetValue<string>("QueryContainer", "default");


// builder.Services.AddDaprClient();
// builder.Services.AddActors(x => { });
// builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();
// builder.Services.AddSingleton<IQueryDebugService>(sp => new QueryDebugService(sp.GetRequiredService<IResultViewClient>(), sp.GetRequiredService<IActorProxyFactory>(), sp.GetRequiredService<DaprClient>(), sp.GetRequiredService<WebSocketService>(), configDirectory, queryContainerId));
// builder.Services.AddHostedService(sp => sp.GetRequiredService<IQueryDebugService>());

// builder.Services.AddSingleton<WebSocketService>();

// var app = builder.Build();
// app.UseCors("AllowAll");
// // app.UseDefaultFiles();
// app.UseStaticFiles();
// app.UseWebSockets();

// // // Configure the HTTP request pipeline.
// // if (app.Environment.IsDevelopment())
// // {
// //     app.UseSwagger();
// //     app.UseSwaggerUI();
// // }

// // app.Urls.Add("http://0.0.0.0:80"); 
// app.Urls.Add("http://0.0.0.0:5195"); 

// app.UseRouting();
// app.UseCloudEvents();

// app.UseEndpoints(endpoints =>
// {
//     var ep = endpoints.MapPost("event", ProcessEvent);

//     foreach (var qpath in Directory.GetFiles(configDirectory))
//     {
//         var queryId = Path.GetFileName(qpath);
//         Console.WriteLine($"Registering {queryId}");
//         ep.WithTopic(pubsubName, queryId + "-results");
//     }        
// });

// // // TODO:controller



// app.UseHttpsRedirection();

// app.UseAuthorization();

// 

// app.MapFallbackToFile("/index.html");

// app.Run();

// async Task ProcessEvent(HttpContext context)
// {
//     try
//     {
//         var debugService = context.RequestServices.GetRequiredService<IQueryDebugService>();
//         var data = await JsonDocument.ParseAsync(context.Request.Body);

//         Console.WriteLine("Got event: " + data.RootElement.GetRawText());

//         // var evt = data.RootElement;
//         // var queryId = evt.GetProperty("queryId").GetString();
//         // if (!File.Exists(Path.Combine(configDirectory, queryId)))
//         // {
//         //     Console.WriteLine("Skipping " + queryId);
//         //     context.Response.StatusCode = 200;
//         //     return;
//         // }
        
//         // switch (evt.GetProperty("kind").GetString()) 
//         // {
//         //     case "control":
//         //         Console.WriteLine("Processing signal " + queryId);
//         //         debugService.ProcessControlSignal(evt);
//         //         break;
//         //     case "change":
//         //         Console.WriteLine("Processing change " + queryId);
//         //         debugService.ProcessRawChange(evt);
//         //         break;
//         // }        

//         context.Response.StatusCode = 200;
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine($"Error processing event: {ex.Message}");
//         throw;
//     }
// }

// static IConfiguration BuildConfiguration()
// {
//     return new ConfigurationBuilder()
//         .SetBasePath(Directory.GetCurrentDirectory())
//         .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
//         .AddEnvironmentVariables()
//         .Build();
// }
