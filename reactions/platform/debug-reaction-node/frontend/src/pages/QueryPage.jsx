import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { connectWebSocket } from "../websocket";

const QueryPage = () => {
  const { queryId } = useParams(); // Get queryId from URL params
  const [data, setData] = useState("");

  console.log("QueryPage: queryId", queryId);
    useEffect(() => {
        const ws = connectWebSocket(queryId, (update) => {
            setData(update.data);
        });


    }, [queryId]);

    return (
      <div>
        <h2>Query: {queryId}</h2>
        <div>
          <h3>Data:</h3>
          {/* Conditionally render the data */}
          {data === null ? (
            <p>Loading...</p>
          ) : Array.isArray(data) ? (
            <ul>
              {data.map((item, index) => (
                <li key={index}>{JSON.stringify(item)}</li> // Render objects as string
              ))}
            </ul>
          ) : (
            <pre>{JSON.stringify(data, null, 2)}</pre> // Render as formatted JSON if it's an object
          )}
        </div>
      </div>
    );
};

QueryPage.propTypes = {
    queryId: PropTypes.string.isRequired,
};


export default QueryPage;

// import { useParams } from "react-router-dom";
// import { useEffect, useState, useRef } from "react";

// const QueryPage = () => {
//   const { queryId } = useParams();
//   const [queryData, setQueryData] = useState(null);
//   const [status, setStatus] = useState("loading");
//   const wsRef = useRef(null); // Store WebSocket reference

//   useEffect(() => {
//     const connectWebSocket = () => {
//       if (wsRef.current) {
//         wsRef.current.close(); // Close any existing connection
//       }

//       if (!queryId) {
//         console.log("No queryId provided");
//       }

//       // http://hello-world-debug-backend-gateway:3001/
//       const ws = new WebSocket(`ws://hello-world-debug-backend-gateway:3001/ws/?queryId=${queryId}`);
//       wsRef.current = ws;

//       ws.onopen = () => {
//         console.log("WebSocket connected");
//         setStatus("connected");
//       };

//       ws.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           if (data.queryId === queryId) {
//             setQueryData(data.data);
//             setStatus("success");
//           }
//         } catch (error) {
//           console.error("Error parsing WebSocket message:", error);
//         }
//       };

//       ws.onclose = () => {
//         console.log("WebSocket disconnected, attempting reconnect...");
//         setStatus("disconnected");
//         setTimeout(connectWebSocket, 5000); // Attempt reconnect after 5s
//       };

//       ws.onerror = (error) => {
//         console.error("WebSocket error:", error);
//         ws.close();
//       };
//     };

//     connectWebSocket();

//     return () => {
//       if (wsRef.current) {
//         wsRef.current.close();
//       }
//     };
//   }, [queryId]);

//   return (
//     <div>
//       <h1>Query {queryId}</h1>
//       {status === "loading" && <p>Waiting for data...</p>}
//       {status === "disconnected" && <p>Reconnecting...</p>}
//       {status === "error" && <p>Error receiving data</p>}
//       {queryData && <pre>{JSON.stringify(queryData, null, 2)}</pre>}
//     </div>
//   );
// };

// export default QueryPage;
