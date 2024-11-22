import './App.css';
import { DrasiResult } from '@drasi/react-signalr-client';
import React from 'react';

const ItemTemplate = props => <div>Test: {props.MessageFrom} - {props.MessageId}</div>

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
      
        <DrasiResult
            url='http://localhost:8082/hub'
            queryId='hello-world-from'>
            <ItemTemplate />
            
            
          </DrasiResult>
---------------
          <DrasiResult
            url='http://localhost:8082/hub'
            queryId='hello-world-from'>
            {(item) => <ItemTemplate {...item} />}
            
            
          </DrasiResult>
        
        
      </header>
    </div>
  );
}

export default App;

//{(item) => <p>foo {item.MessageId} - {item.MessageFrom} </p>}
/*
{data => (
              <div>
                <h1>Drasi SignalR Client</h1>
                <h2>Message: {data.MessageFrom}</h2>
              </div>
            )}
              */