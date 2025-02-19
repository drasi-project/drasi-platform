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
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;

using System.Text.Json;
using System.Text;
using System.Net.WebSockets;

var builder = WebApplication.CreateBuilder(args);

var configuration = BuildConfiguration();

var pubsubName = configuration.GetValue<string>("PubsubName", "drasi-pubsub");
var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
var queryContainerId = configuration.GetValue<string>("QueryContainer", "default");


// Reaction SDK
var reaction = new ReactionBuilder()
				   .UseChangeEventHandler<ChangeHandler>()
				   .UseControlEventHandler<ControlSignalHandler>()
				   .ConfigureServices((services) =>
				   {
					   services.AddSingleton<WebSocketService>();
					   services.AddDaprClient();
					   services.AddActors(x => { });
					   services.AddSingleton<IResultViewClient, ResultViewClient>();
					   // services.AddSingleton<IActorProxyFactory, ActorProxyFactory>();
					   services.AddSingleton<IQueryDebugService>(sp => new QueryDebugService(sp.GetRequiredService<IResultViewClient>(), sp.GetRequiredService<IActorProxyFactory>(), sp.GetRequiredService<DaprClient>(), sp.GetRequiredService<WebSocketService>(), configDirectory, queryContainerId));
					   services.AddHostedService(sp => sp.GetRequiredService<IQueryDebugService>());
					   services.AddCors(options =>
					   {
						   options.AddPolicy("AllowAll",
							   policy =>
							   {
								   policy.AllowAnyOrigin()
										 .AllowAnyMethod()
										 .AllowAnyHeader();
							   });
					   });
				   }).Build();


if (!reaction.App().Environment.IsDevelopment())
{
	reaction.App().UseExceptionHandler("/Error");
}
reaction.App().UseStaticFiles();
reaction.App().UseRouting();
reaction.App().UseCors("AllowAll");
reaction.App().UseCloudEvents();
reaction.App().MapControllers();
reaction.App().UseWebSockets();

LinkedList<JsonElement> stream = new();

// Add a get endpoint
// reaction.App().MapGet("/query/initialize/{queryId}", async (string queryId, IQueryDebugService debugService) =>
// {
// 	var result = await debugService.GetQueryResult(queryId);
// 	return Results.Json(result);
// });

// // Used for reinitializing a query
// reaction.App().MapGet("/query/reinitialize/{queryId}", async (string queryId, IQueryDebugService debugService) =>
// {
// 	var result = await debugService.ReinitializeQuery(queryId);
// 	return Results.Json(result);
// });

reaction.App().MapGet("/stream", async (IQueryDebugService debugService) =>
{
	return Results.Json(await debugService.GetRawEvents());
});


// Debug info
// reaction.App().MapGet("/query/debug/{queryId}", async (string queryId, IQueryDebugService debugService) =>
// {
// 	var result = await debugService.GetDebugInfo(queryId);
// 	return Results.Json(result);
// });


reaction.App().Use(async (context, next) =>
{
	if (context.Request.Path.StartsWithSegments("/ws/query"))
	{
		if (context.WebSockets.IsWebSocketRequest)
		{
			var webSocket = await context.WebSockets.AcceptWebSocketAsync();
			var pathSegments = context.Request.Path.Value.Split('/');
			var queryId = string.Empty;
			if (pathSegments.Length > 3)
			{
				queryId = pathSegments[3];
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
			}
		}
		else
		{
			context.Response.StatusCode = 400; // Bad Request if not a WebSocket request
		}
	}
	else if (context.Request.Path.StartsWithSegments("/ws/stream"))
	{
		if (context.WebSockets.IsWebSocketRequest)
		{
			var webSocket = await context.WebSockets.AcceptWebSocketAsync();
			Console.WriteLine("WebSocket connected");

			var streamService = context.RequestServices.GetRequiredService<WebSocketService>();
			streamService.AddConnection("stream", webSocket);

			var buffer = new byte[1024 * 4];
			while (webSocket.State == WebSocketState.Open)
			{
				var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
				if (result.MessageType == WebSocketMessageType.Close)
				{
					Console.WriteLine("WebSocket for Event Stream closing");
					await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closed connection", CancellationToken.None);
					return;
				}
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

static IConfiguration BuildConfiguration()
{
	return new ConfigurationBuilder()
		.SetBasePath(Directory.GetCurrentDirectory())
		.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
		.AddEnvironmentVariables()
		.Build();
}

await reaction.StartAsync();


public class ChangeHandler : IChangeEventHandler
{
	private readonly IQueryDebugService _debugService;
	private readonly ILogger<ChangeHandler> _logger;


	public ChangeHandler(IQueryDebugService debugService, ILogger<ChangeHandler> logger)
	{
		_debugService = debugService;
		_logger = logger;
	}

	public async Task HandleChange(ChangeEvent evt, object? queryConfig)
	{
		var queryId = evt.QueryId;
		var jsonEvent = JsonSerializer.Deserialize<JsonElement>(evt.ToJson());
		await _debugService.ProcessRawEvent(jsonEvent);
		await _debugService.ProcessRawChange(queryId, jsonEvent);
	}
}


public class ControlSignalHandler : IControlEventHandler
{
	private readonly IQueryDebugService _debugService;
	private readonly ILogger<ControlSignalHandler> _logger;

	public ControlSignalHandler(IQueryDebugService debugService, ILogger<ControlSignalHandler> logger)
	{
		_debugService = debugService;
		_logger = logger;
	}

	public async Task HandleControlSignal(ControlEvent evt, object? queryConfig)
	{
		var queryId = evt.QueryId;
		var jsonEvent = JsonSerializer.Deserialize<JsonElement>(evt.ToJson());
		await _debugService.ProcessRawEvent(jsonEvent);
		await _debugService.ProcessControlSignal(queryId, jsonEvent);
	}
}
