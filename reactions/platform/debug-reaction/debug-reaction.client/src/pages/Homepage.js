import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3001";

const HomePage = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueries = async () => {
      try {

        // Fetch from the backend API
        const response = await fetch("http://localhost:5195/queries");
        if (!response.ok) {
          throw new Error("Failed to fetch queries");
        }
        const data = await response.json();
        setQueries(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  if (loading) {
    return <p>Loading queries...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Query Dashboard</h1>
      <ul>
        {queries.map((query) => (
          <li key={query}>
            <Link to={`/query/${query}`}>{query}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
