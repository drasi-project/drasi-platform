// Copyright 2025 The Drasi Authors
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


using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Drasi.Reactions.Debug.Server.Models;
using Drasi.Reactions.Debug.Server.Services;


[Route("api/ws")]
public class WebSocketController : ControllerBase
{
	private readonly IChangeBroadcaster _webSocketService;
	private readonly ILogger<WebSocketController> _logger;

	public WebSocketController(IChangeBroadcaster webSocketService, ILogger<WebSocketController> logger)
	{
		_webSocketService = webSocketService;
		_logger = logger;
	}

	[Route("query/{queryId?}")]
	public async Task Query(string? queryId)
	{
		if (!HttpContext.WebSockets.IsWebSocketRequest)
		{
			HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
			return;
		}

		if (string.IsNullOrEmpty(queryId))
		{
			using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
			await webSocket.CloseAsync(WebSocketCloseStatus.InvalidPayloadData, "Invalid queryId", CancellationToken.None);
			return;
		}

		using var webSocketQuery = await HttpContext.WebSockets.AcceptWebSocketAsync();
		_webSocketService.AddConnection(queryId, webSocketQuery);
		_logger.LogInformation($"WebSocket connected for queryId: {queryId}");

		var buffer = new byte[1024 * 4];
		var lastPingTime = DateTime.Now;

		try
		{
			while (webSocketQuery.State == WebSocketState.Open)
			{
				var result = await webSocketQuery.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
				if (result.MessageType == WebSocketMessageType.Close)
				{
					_logger.LogInformation($"WebSocket closing for queryId: {queryId}");
					await webSocketQuery.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closed connection", CancellationToken.None);
					return;
				}
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, $"WebSocket error for queryId: {queryId}");
			await webSocketQuery.CloseAsync(WebSocketCloseStatus.InternalServerError, "Server error", CancellationToken.None);
		}
	}

	[Route("stream")]
	public async Task Stream()
	{
		if (!HttpContext.WebSockets.IsWebSocketRequest)
		{
			HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
			return;
		}

		using var webSocketStream = await HttpContext.WebSockets.AcceptWebSocketAsync();
		_webSocketService.AddConnection("stream", webSocketStream);
		_logger.LogInformation($"WebSocket connected for Event Stream");

		var buffer = new byte[1024 * 4];

		try
		{
			while (webSocketStream.State == WebSocketState.Open)
			{
				var result = await webSocketStream.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
				if (result.MessageType == WebSocketMessageType.Close)
				{
					_logger.LogInformation($"WebSocket closing for Event Stream");
					await webSocketStream.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closed connection", CancellationToken.None);
					return;
				}
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "WebSocket error for Event Stream");
			await webSocketStream.CloseAsync(WebSocketCloseStatus.InternalServerError, "Server error", CancellationToken.None);
		}
	}
}
