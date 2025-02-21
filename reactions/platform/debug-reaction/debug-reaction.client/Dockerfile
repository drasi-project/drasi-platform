# Copyright 2025 The Drasi Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Stage 1: Build the Vite React App
FROM node:22 AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Node.js
FROM node:22

WORKDIR /app

# Install a lightweight HTTP server
RUN npm install -g serve

# Copy built frontend files
COPY --from=builder /app/dist ./dist

# Expose port 8080
EXPOSE 8080

# Start the app using serve
CMD ["serve", "-s", "dist", "-l", "8080"]
