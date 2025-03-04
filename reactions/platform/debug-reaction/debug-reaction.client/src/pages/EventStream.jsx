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
    const [stream, setStream] = useState(() => {
        // Load initial state from localStorage, fallback to empty array
        // This local storage is only used to persist the eventstream data
        const savedStream = localStorage.getItem("eventStream");
        return savedStream ? JSON.parse(savedStream) : [];
    });
    const WEBSOCKET_URL = "/api/ws/stream";

    useEffect(() => {
        const ws = new WebSocket(WEBSOCKET_URL);

        ws.onopen = () => {
            setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: "ping" }));
                }
            }, 25000);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setStream((prevStream) => {
                    const newStream = [data, ...prevStream];
                    while (newStream.length > 100) {
                        newStream.pop();
                    }
                    // Persist to localStorage after updating
                    localStorage.setItem("eventStream", JSON.stringify(newStream));
                    return newStream;
                });
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = (event) => {
            console.log("WebSocket closed:", event.code, event.reason);
        };

        // Cleanup WebSocket on unmount
        return () => {
            ws.close();
        };
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
