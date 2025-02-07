import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const QueryPage = () => {
  const { queryId } = useParams();
  const [queryData, setQueryData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/query/${queryId}`); // Corrected URL
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        console.log("Response:", response);
        const data = await response.json();
        setQueryData(data);
        setStatus("success");
      } catch (error) {
        console.error("Error fetching query data:", error);
        setStatus("error");
      }
    };

    fetchData();

    const ws = new WebSocket(`ws://localhost:3001/?queryId=${queryId}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.queryId === queryId) {
        setQueryData(data.data);
      }

    };

    return () => {
      ws.close();
    };
  }, [queryId]);

  return (
    <div>
      <h1>Query {queryId}</h1>
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p>Error fetching data</p>}
      {queryData && <pre>{JSON.stringify(queryData, null, 2)}</pre>}
    </div>
  );
};

export default QueryPage;
