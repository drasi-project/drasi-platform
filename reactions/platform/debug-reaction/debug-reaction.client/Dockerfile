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
