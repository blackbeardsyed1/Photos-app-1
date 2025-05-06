# Use official Node.js LTS base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy rest of the application
COPY . .

# Expose the app port
EXPOSE 5000

# Start the Node.js app
CMD ["node", "server.js"]
