import './App.css';
import { ExampleComponent } from '@drasi/react-signalr-client';
import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <ExampleComponent text='foo bar baz' />
        
        
      </header>
    </div>
  );
}

export default App;
