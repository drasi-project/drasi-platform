
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';


export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 8080, // You can change this if needed
        https: false
    }
});
