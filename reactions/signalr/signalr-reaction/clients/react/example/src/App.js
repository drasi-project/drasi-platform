import './App.css';
import { DrasiResult, ReactionListener } from '@drasi/react-signalr-client';
import React from 'react';

let rl = new ReactionListener('http://localhost:8082/hub', 'message-count', (evt) => {
  console.log(evt.op);
  console.log(JSON.stringify(evt.payload));
});
rl.reload(data => {
  console.log("reload");
  console.log(JSON.stringify(data));
})

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
            <DrasiResult
              url='http://localhost:8082/hub'              
              queryId='hello-world-from'
              sortBy={item => item.MessageFrom}>
              {item => 
                <tr>
                  <td>{item.MessageId}</td>
                  <td>{item.MessageFrom}</td>
                </tr>
              }
            </DrasiResult>
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;