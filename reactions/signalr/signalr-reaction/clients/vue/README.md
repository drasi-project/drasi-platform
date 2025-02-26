# Vue Components for Drasi SignalR

This library provides Vue components for streaming changes from the [Drasi](http://drasi.io) SignalR Reaction.

## Getting started

### Install the package

```
npm install --save @drasi/signalr-vue
```

### ResultSet Component

The `ResultSet` component requires an endpoint to the SignalR reaction and a query ID. It will render a copy of it's children for every item in the result set of that query, and keep the data up to date via the SignalR connection.

```vue
<ResultSet url="<your signalr endpoint>" queryId="<query name>" :sortBy="item => item.field1">
    <template #default="{ item, index }">
        <span>{{ item.field1 }}</span>
        <span>{{ item.field2 }}</span>
    </template>
</ResultSet>
```

### Basic example

```vue
<script setup>
import { ResultSet } from '@drasi/signalr-vue';
</script>

<template>
  <main>
    <table>
      <thead>
        <tr>
          <th>Message ID</th>
          <th>Message From</th>
        </tr>
      </thead>
      <tbody>
        <ResultSet url="http://localhost:8080/hub" queryId="hello-world-from" :sortBy="x => x.MessageFrom">
          <template #default="{ item, index }">
            <tr>              
              <td>{{ item.MessageId }}</td>
              <td>{{ item.MessageFrom }}</td>
            </tr>
          </template>
        </ResultSet>
      </tbody>
    </table>
  </main>
</template>
```