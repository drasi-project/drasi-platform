import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import QueryPage from './pages/QueryPage';
import './App.css';

function App() {
    const [queries, setQueries] = useState([]);

    useEffect(() => {
        fetchQueries();
    }, []);

    return (
        <Router>
            <div className="app-container">
                <div className="sidebar">
                    <h2>Queries</h2>
                    <ul>
                        {queries.map((query) => (
                            <li key={query}>
                                <Link to={`/query/${query}`}>{query}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="content">
                    <Routes>
                        <Route path="/query/:queryId" element={<QueryPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );

    async function fetchQueries() {
        try {
            const response = await fetch('http://localhost:5195/queries');
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setQueries(data);
            }
        } catch (error) {
            console.error('Error fetching queries:', error);
        }
    }
}

export default App;