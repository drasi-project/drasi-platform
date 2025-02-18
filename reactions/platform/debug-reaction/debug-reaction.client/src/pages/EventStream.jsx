import React, { useState, useEffect } from "react";

function EventStream() {
    const [stream, setStream] = useState([]);
    
    const fetchStream = async () => {
        try {
            const url = "http://localhost:5195/stream";
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const stream = await response.json();
            console.log(stream);
            setStream(stream);
        } catch (error) {
            console.error("Error fetching stream:", error);
        }
    };

    useEffect(() => {
        fetchStream();
    }, []);
    

    return (
        <div>
            <h2>Event Stream</h2>
            <div>
                {stream.map((event, index) => (
                    <div key={index} className="alert alert-secondary">
                        {JSON.stringify(event)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventStream;
