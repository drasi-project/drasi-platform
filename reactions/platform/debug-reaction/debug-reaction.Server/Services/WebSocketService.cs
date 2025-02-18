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