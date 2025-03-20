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

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import QueryPage from './pages/QueryPage';
import EventStreamPage from './pages/EventStream';
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
                    <h2>
                        <Link to="/stream">Event Stream</Link>
                    </h2>
                    <h2>Active Queries: </h2>
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
                        <Route path="stream" element={<EventStreamPage/> } />
                        <Route path="/query/:queryId" element={<QueryPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );

    async function fetchQueries() {
        try {
            const response = await fetch('/api/queries');
            if (response.ok) {
                const data = await response.json();
                setQueries(data);
            }
        } catch (error) {
            console.error('Error fetching queries:', error);
        }
    }
}

export default App;