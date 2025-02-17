using System.Net.WebSockets;
using System.Collections.Concurrent;
using System.Text;
using Drasi.Reactions.Debug.Server.Models;
using System.Text.Json;


public class WebSocketService
{
    private readonly ConcurrentDictionary<string, WebSocket> _connections = new();

    public void AddConnection(string queryId, WebSocket webSocket)
    {
        _connections[queryId] = webSocket;
        Console.WriteLine($"[{DateTime.UtcNow}] WebSocket registered for {queryId}");
    }

    public async Task BroadcastToQueryId(string queryId, QueryResult message)
    {
        Console.WriteLine($"[{DateTime.UtcNow}] Broadcasting message to {queryId}");
        if (_connections.ContainsKey(queryId))
        {
            var jsonMessage = JsonSerializer.Serialize(message);
            var webSocket = _connections[queryId];
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
            // foreach (var webSocket in _connections.Values)
            // {
            //     if (webSocket.State == WebSocketState.Open)
            //     {
            //         try
            //         {
            //             var buffer = Encoding.UTF8.GetBytes(jsonMessage);
            //             await webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
            //         }
            //         catch (Exception ex)
            //         {
            //             Console.WriteLine($"[{DateTime.UtcNow}] Error sending message to WebSocket: {ex.Message}");
            //         }
            //     }
            // }
        }
    }
}