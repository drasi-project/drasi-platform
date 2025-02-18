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

LinkedList<JsonElement> stream = new();

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


// Debug info
app.MapGet("/query/debug/{queryId}", async (string queryId, IQueryDebugService debugService) =>
{
    var result = await debugService.GetDebugInfo(queryId);
    return Results.Json(result);
});

// Event stream
app.MapGet("/stream", async (HttpContext context) =>
{
    return Results.Json(stream);
    // var buffer = new byte[1024 * 4];
    // var webSocket = await context.WebSockets.AcceptWebSocketAsync();
    // Console.WriteLine("WebSocket connected");

    // while (webSocket.State == WebSocketState.Open)
    // {
    //     lock (stream)
    //     {
    //         foreach (var item in stream)
    //         {
    //             var jsonMessage = item.GetRawText();
    //             var buffer = Encoding.UTF8.GetBytes(jsonMessage);
    //             await webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
    //         }
    //     }

    //     // Wait for a message from the client
    //     var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
    //     if (result.MessageType == WebSocketMessageType.Close)
    //     {
    //         Console.WriteLine("WebSocket closing");
    //         await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closed connection", CancellationToken.None);
    //         return;
    //     }
    // }
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
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                
                if (result.MessageType == WebSocketMessageType.Close)
                {
                    Console.WriteLine($"WebSocket closing for queryId: {queryId}");
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closed connection", CancellationToken.None);
                    return;
                }

                // Handle incoming messages (if needed)
                Console.WriteLine($"Received message for queryId {queryId}: {Encoding.UTF8.GetString(buffer, 0, result.Count)}");
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
        lock (stream)
        {
            stream.AddFirst(evt);
            while (stream.Count > 100)
            {
                stream.RemoveLast();
            }
        }
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