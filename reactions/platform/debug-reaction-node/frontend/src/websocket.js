export const connectWebSocket = (queryId, onUpdate) => {
  const ws = new WebSocket(`ws://localhost:3001/ws/?queryId=${queryId}`);

  ws.onopen = () => {
      ws.send(JSON.stringify({ queryId }));
  };

  ws.onmessage = (event) => {
    console.log(`Received WebSocket message: ${event.data}`);
      const data = JSON.parse(event.data);
      onUpdate(data);
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
  };



  return ws;
};
