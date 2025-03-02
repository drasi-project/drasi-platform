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
using Drasi.Reaction.SDK.Services;
using Drasi.Reaction.SDK.Models.QueryOutput;

using System.Text.Json;
using System.Text;
using System.Net.WebSockets;

using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

public class Program
{
	public static async Task Main(string[] args)
	{
		var builder = WebApplication.CreateBuilder();
		builder.Services.AddSingleton<IChangeBroadcaster, WebSocketService>();
		builder.Services.AddDaprClient();
		builder.Services.AddControllers();
		builder.Services.AddActors(x => { });
		builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();
		builder.Services.AddSingleton<IManagementClient, ManagementClient>();
		builder.Services.AddSingleton<IQueryDebugService>(sp => new QueryDebugService(
			sp.GetRequiredService<IResultViewClient>(),
			sp.GetRequiredService<IActorProxyFactory>(),
			sp.GetRequiredService<DaprClient>(),
			sp.GetRequiredService<IChangeBroadcaster>(),
			sp.GetRequiredService<ILogger<QueryDebugService>>(),
			sp.GetRequiredService<IManagementClient>()));
		builder.Services.AddHostedService(sp => sp.GetRequiredService<IQueryDebugService>());
		builder.Services.AddCors(options =>
		{
			options.AddPolicy("AllowAll", policy =>
			{
				policy.AllowAnyOrigin()
					  .AllowAnyMethod()
					  .AllowAnyHeader();
			});
		});

		var server = builder.Build();
		if (!server.Environment.IsDevelopment())
		{
			server.UseExceptionHandler("/Error");
		}

		server.UseCors("AllowAll");
		server.UseStaticFiles();
		server.UseRouting();
		server.UseCloudEvents();
		server.MapControllers();
		server.UseWebSockets();


		server.MapGet("/stream", async (IQueryDebugService debugService) =>
		{
			return Results.Json(await debugService.GetRawEvents());
		});

		server.Use(async (context, next) =>
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
					var webSocketService = context.RequestServices.GetRequiredService<IChangeBroadcaster>();
					webSocketService.AddConnection(queryId, webSocket);

					// Handle WebSocket connection
					server.Logger.LogInformation($"WebSocket connected for queryId: {queryId}hange");

					var buffer = new byte[1024 * 4];
					var lastPingTime = DateTime.Now;
					while (webSocket.State == WebSocketState.Open)
					{
						var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

						if (result.MessageType == WebSocketMessageType.Close)
						{
							server.Logger.LogInformation($"WebSocket closing for queryId: {queryId}");
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
					server.Logger.LogInformation($"WebSocket connected for Event Stream");

					var streamService = context.RequestServices.GetRequiredService<IChangeBroadcaster>();
					streamService.AddConnection("stream", webSocket);

					var buffer = new byte[1024 * 4];
					while (webSocket.State == WebSocketState.Open)
					{
						var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
						if (result.MessageType == WebSocketMessageType.Close)
						{
							server.Logger.LogInformation($"WebSocket closing for Event Stream");
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

		var port = Environment.GetEnvironmentVariable("PORT") ?? "5195";
		server.Urls.Add($"http://0.0.0.0:{port}");
		server.Logger.LogInformation("Application configured to listen on: {Urls}", string.Join(", ", server.Urls));

		var reaction = new ReactionBuilder()
			.UseChangeEventHandler<ChangeHandler>()
			.UseControlEventHandler<ControlSignalHandler>()
			.ConfigureServices(services =>
			{
				// Share services with the reaction system
				services.AddSingleton(sp => server.Services.GetRequiredService<IChangeBroadcaster>());
				services.AddSingleton(sp => server.Services.GetRequiredService<IQueryDebugService>());
			})
			.Build();

		server.Lifetime.ApplicationStarted.Register(() => StartupTask.SetResult());
		await Task.WhenAll(reaction.StartAsync(ShutdownToken.Token), server.RunAsync());
	}
	public static TaskCompletionSource StartupTask { get; } = new();

	public static CancellationTokenSource ShutdownToken { get; } = new();
}

