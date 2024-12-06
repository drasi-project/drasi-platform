# Drasi SignalR Vue Components Example

This folder contains a basic Vue application that illustrates basic usage of the `ResultSet` component. The query it connects to is part of the [Drasi Getting started tutorial](https://drasi.io/getting-started/).

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

## Running the example

Install the dependencies:

```
npm install
```

Start the development server:

```
npm run start
```
