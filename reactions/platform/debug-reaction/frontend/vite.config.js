import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080, // Set the development server to run on port 8080
    proxy: {
      "/queries": "http://hello-world-debug-backend-gateway:3001", // Proxy all requests to /queries to the backend
    },
  },
})
