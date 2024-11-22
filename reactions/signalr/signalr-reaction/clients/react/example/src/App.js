import './App.css';
import { ResultSet } from '@drasi/signalr-react';
import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <table>
          <thead>
            <tr>
              <th>Message ID</th>
              <th>Message From</th>
            </tr>  
          </thead>
          <tbody>
            <ResultSet
              url='http://localhost:8080/hub'              
              queryId='hello-world-from'
              sortBy={item => item.MessageFrom}>
              {item => 
                <tr>
                  <td>{item.MessageId}</td>
                  <td>{item.MessageFrom}</td>
                </tr>
              }
            </ResultSet>
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;