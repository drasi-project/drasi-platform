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

import React, { useState, useEffect } from "react";

function EventStream() {
    const [stream, setStream] = useState([]);
    const WEBSOCKET_URL = "ws://localhost:5195/ws/stream";

    // const fetchStream = async () => {
    //     try {
    //         const url = "http://localhost:5195/stream";
    //         const response = await fetch(url);

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }
    //         const stream = await response.json();
    //         setStream(stream);
    //     } catch (error) {
    //         console.error("Error fetching stream:", error);
    //     }
    // };
    useEffect(() => {
        const ws = new WebSocket(WEBSOCKET_URL);

        // fetchStream();
        ws.onopen = () => {
            setInterval(() => {
                if (ws.readyState == WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: "ping" }));
                }
            }, 25000);
        };

        ws.onmessage = (event) => {
            try  {
                const data = JSON.parse(event.data);
                setStream((prevStream) => {
                    const newStream = [data, ...prevStream];
                    while (newStream.length > 100) {
                        newStream.pop();
                    }
                    return newStream;
                });
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
  
        ws.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason);
        };

        // Closing the web socket on component unmount
        return () => {
            ws.close();
        }
    }, []);
    

    return (
        <div className="event-stream-container">
            <h2>Event Stream</h2>
            <div>
                {stream.map((event, index) => (
                    <div key={index} className="event-entry">
                        {JSON.stringify(event, null, 2)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventStream;
