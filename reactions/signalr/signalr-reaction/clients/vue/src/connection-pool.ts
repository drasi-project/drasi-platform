import * as signalR from "@microsoft/signalr";

const connections = new Map();

export function getConnection(url: string) {
  if (!connections.has(url)) {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .build();
    connections.set(url, {
      connection: connection,
      started: connection.start()
    });    
  }
  return connections.get(url);
}