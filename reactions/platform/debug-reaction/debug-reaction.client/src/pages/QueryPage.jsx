/**
 * Copyright 2025 The Drasi Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { React, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';


function QueryPage() {
  const { queryId } = useParams(); // useParams hook for getting the route parameter
  const [queries, setQueries] = useState([]);
  const [queryError, setQueryError] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [debugInfo, setDebugInfo] = useState({});

  // Fetch the initial data on page load 
  const intialize = async () => {
    try {
        const API_URL = `http://localhost:5195/query/initialize/${queryId}`;
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      setQueries(data.data); // Set initial data
      setQueryError(data.error); // Set initial data
      setFieldNames(data.fieldNames); // Set initial data
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
      setQueries(data.data);
      setQueryError(data.error);
      setFieldNames(data.fieldNames);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const debugQuery = async () => {
    try {
      const debug_url = `http://localhost:5195/query/debug/${queryId}`;
        const response = await fetch(debug_url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setDebugInfo(data); // Set initial data    

    } catch (error) {
        console.error("Error fetching initial data:", error);
    }
  };

  useEffect(() => {
      if (!queryId) return;
      const WEBSOCKET_URL = `ws://localhost:5195/ws/query/${queryId}`;
      

  
      intialize();
      debugQuery();
      const ws = new WebSocket(WEBSOCKET_URL);

      ws.onopen = () => {
          console.log(`WebSocket connected for Query ID: ${queryId}`);
          setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping" }));
            }
          }, 25000);
      };

      ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
              setQueries(message["Data"]);
              setQueryError(message["Error"]);
              setFieldNames(message["FieldNames"]);
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


      return () => {
        console.log(`Closing WebSocket for Query ID: ${queryId}`);
          ws.close();
      };
  }, [queryId]);
return (
        <div>
                <h1>Query Results - {queryId}</h1>
                <table className="table">
                    <thead>
                      <tr>
                          {fieldNames.map((fieldName, index) => (
                              <th key={index}>{fieldName}</th>
                          ))}
                      </tr>
                  </thead>
                  <tbody>
                      {queries.map((query, index) => (
                          <tr key={index}>
                              {Object.values(query).map((value, i) => (
                                  <td key={i}>{value}</td>
                              ))}
                          </tr>
                      ))}
                  </tbody>
                </table>
                <h2>Debug Info</h2>
                {Object.entries(debugInfo).map(([key, value]) => (
                    <p key={key}>
                        {key}: {value}
                    </p>
                ))}
                <button className="btn btn-secondary" onClick={reinitialize}>Refetch Query Cache </button>
        </div>
);
}


export default QueryPage;
