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
        <ResultSet url="http://localhost:8082/hub" queryId="hello-world-from" :sortBy="x => x.MessageFrom">
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
