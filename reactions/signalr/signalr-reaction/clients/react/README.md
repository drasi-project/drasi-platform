# React Components for Drasi SignalR

This library provides React components for streaming changes from the [Drasi](http://drasi.io) SignalR Reaction.

## Getting started

### Install the package

```
npm install --save @drasi/signalr-react
```

### ResultSet Component

The `ResultSet` component requires an endpoint to the SignalR reaction and a query ID. It will render a copy of it's children for every item in the result set of that query, and keep the data up to date via the SignalR connection.

```jsx
<ResultSet url='<Your Drasi SignalR endpoint>' queryId='<query name>' sortBy={item => item.field1}>
    {item => 
        <div>
            <span>{item.field1}</span>
            <span>{item.field2}</span>
        </div>
    }
</ResultSet>
```

### Basic example

```javascript
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
            <ResultSet url='http://localhost:8080/hub' queryId='hello-world-from'>
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
```