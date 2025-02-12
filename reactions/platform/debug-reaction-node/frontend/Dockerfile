# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port for Vite's development server
EXPOSE 8080

# Start the frontend in development mode
CMD ["npm", "run", "dev", "--", "--host"]
