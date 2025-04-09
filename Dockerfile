# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies, including globally installing concurrently
RUN npm install && npm install -g concurrently

# Copy the rest of the application code to the working directory
COPY . .

# Expose the application port and WebSocket server port
EXPOSE 3000 8080

# Start both the application and the WebSocket server
CMD ["npm", "run", "start:all"]


