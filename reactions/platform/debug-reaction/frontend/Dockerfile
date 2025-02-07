# Use official Node.js image to build the app
FROM node:22 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Build the app for production
RUN npm run build

# Serve the app with Nginx
FROM nginx:alpine

# Copy the build from the previous stage to the Nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx will serve on
EXPOSE 8080

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
