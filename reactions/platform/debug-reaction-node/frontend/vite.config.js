import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // This allows access from outside the container
    port: 8080, // Ensure the port matches the one exposed in Dockerfile
  },
});
