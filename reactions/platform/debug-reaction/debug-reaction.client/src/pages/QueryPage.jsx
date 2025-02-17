import { React, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';


function QueryPage() {
  const { queryId } = useParams(); // useParams hook for getting the route parameter
  const [queries, setQueries] = useState([]);
  const [socket, setSocket] = useState(null);

  // Fetch the initial data on page load 
  const intialize = async () => {
    try {
        const API_URL = `http://localhost:5195/query/initialize/${queryId}`;
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      setQueries(data.data); // Set initial data
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const reinitialize = async () => {
    try {
        const API_URL = `http://localhost:5195/query/reinitialize/${queryId}`;
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      setQueries(data.data); // Set initial data
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };
  useEffect(() => {
      if (!queryId) return;
      const WEBSOCKET_URL = `ws://localhost:5195/ws/query/${queryId}`;
      

  
      intialize();

      const ws = new WebSocket(WEBSOCKET_URL);

      ws.onopen = () => {
          console.log(`WebSocket connected for Query ID: ${queryId}`);
          ws.send(JSON.stringify({ type: 'subscribe', queryId }));
      };

      ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log('Received message:', event.data);
            //   const message = JSON.parse(event);
              console.log('Received message data:', message["Data"]);
              setQueries(message["Data"]);
              console.log('current queries:', queries);
          } catch (error) {
              console.error('Error parsing WebSocket message:', error);
          }
      };

      ws.onerror = (error) => {
          console.error('WebSocket error:', error);
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        };

      setSocket(ws);

      return () => {
        console.log(`Closing WebSocket for Query ID: ${queryId}`);
          ws.close();
      };
  }, [queryId]);
return (
        <div>
                <h1>Query: {queryId}</h1>
                <ul>
                        {queries.map((query, index) => (
                                <li key={index}>{JSON.stringify(query)}</li>
                        ))}
                </ul>
                <button onClick={reinitialize}>Refetch Query Cache </button>
        </div>
);
}


export default QueryPage;
