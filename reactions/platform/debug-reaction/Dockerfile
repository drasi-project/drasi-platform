# Stage 1: Build the Frontend
FROM node:22 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build  # Vite builds to "dist" by default

# Stage 2: Build the Backend
FROM node:22 AS backend
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm install
COPY backend ./

# Stage 3: Create the Final Image
FROM node:22 AS final
WORKDIR /app

# Copy backend files
COPY --from=backend /app/backend /app/backend

# Copy frontend build to serve it with backend
COPY --from=frontend /app/frontend/dist /app/backend/public

# Set working directory for backend
WORKDIR /app/backend

# Expose backend API (if needed)
EXPOSE 3000
# Expose frontend (if served via backend)
EXPOSE 8080

# Start the backend (serving frontend too)
CMD ["node", "index.js"]
