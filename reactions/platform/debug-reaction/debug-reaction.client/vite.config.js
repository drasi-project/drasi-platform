import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';


const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7230';

export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/queries': {
                target,
                secure: false
            }
        },
        port: 8080, // You can change this if needed
        https: false
        // Remove the https configuration
    }
});

// // https://vitejs.dev/config/
// export default defineConfig({
//     plugins: [plugin()],
//     resolve: {
//         alias: {
//             '@': fileURLToPath(new URL('./src', import.meta.url))
//         }
//     },
//     server: {
//         proxy: {
//             '^/weatherforecast': {
//                 target,
//                 secure: false
//             }
//         },
//         port: 53269,
//         https: {
//             key: fs.readFileSync(keyFilePath),
//             cert: fs.readFileSync(certFilePath),
//         }
//     }
// })
