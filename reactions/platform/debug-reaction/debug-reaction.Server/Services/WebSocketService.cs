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

using System.Net.WebSockets;
using System.Collections.Concurrent;
using System.Text;
using Drasi.Reactions.Debug.Server.Models;
using System.Text.Json;


public class WebSocketService
{
	private readonly ConcurrentDictionary<string, WebSocket> _connections = new();

	public void AddConnection(string socketName, WebSocket webSocket)
	{
		_connections[socketName] = webSocket;
		Console.WriteLine($"[{DateTime.UtcNow}] WebSocket registered for {socketName}");
	}

	public async Task BroadcastToQueryId(string socketName, QueryResult message)
	{
		Console.WriteLine($"[{DateTime.UtcNow}] Broadcasting message to query: {socketName}");
		if (_connections.ContainsKey(socketName))
		{
			var jsonMessage = JsonSerializer.Serialize(message);
			var webSocket = _connections[socketName];
			if (webSocket.State == WebSocketState.Open)
			{
				try
				{
					var buffer = Encoding.UTF8.GetBytes(jsonMessage);
					await webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
				}
				catch (Exception ex)
				{
					Console.WriteLine($"[{DateTime.UtcNow}] Error sending message to WebSocket: {ex.Message}");
				}
			}
		}
	}

	public async Task BroadcastToStream(string socketName, LinkedList<JsonElement> message)
	{
		Console.WriteLine($"[{DateTime.UtcNow}] Broadcasting message to stream");
		if (_connections.ContainsKey(socketName))
		{
			var jsonMessage = JsonSerializer.Serialize(message);
			var webSocket = _connections[socketName];
			if (webSocket.State == WebSocketState.Open)
			{
				try
				{
					var buffer = Encoding.UTF8.GetBytes(jsonMessage);
					await webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
				}
				catch (Exception ex)
				{
					Console.WriteLine($"[{DateTime.UtcNow}] Error sending message to WebSocket: {ex.Message}");
				}
			}
		}
	}
}
