/**
 * Copyright 2025 The Drasi Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */




import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Rename 'plugin' to 'react' for clarity

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist', // Ensure output goes to 'dist' (matches Dockerfile)
    },
    base: '/', // Ensure assets are referenced from the root
});