import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import React, { useState, useEffect } from "react";
import React from "react";
// import HomePage from "./pages/HomePage";
import { fetchQueries } from "./api";
import QueryPage from "./pages/QueryPage";
import HomePage  from "./pages/HomePage";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/query/:queryId" element={<QueryPage />} />
            </Routes>
        </Router>
    );
};
//   const [queries, setQueries] = useState([]);

//   useEffect(() => {
//       fetchQueries().then(setQueries);
//   }, []);

//   return (
//       <div>
//           <h1>Query Dashboard</h1>
//           {queries.map((q) => (
//               <QueryPage key={q.id} queryId={q.id} />
//           ))}
//       </div>
//   );
// };

export default App;
