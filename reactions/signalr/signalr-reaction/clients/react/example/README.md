# Drasi SignalR React Components Example

This folder contains a basic React application that illustrates basic usage of the `ResultSet` component. The query it connects to is part of the [Drasi Getting started tutorial](https://drasi.io/getting-started/).

```jsx
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
```

## Running the example

Install the dependencies:

```
npm install
```

Start the development server:

```
npm start
```

Browse to http://localhost:3000