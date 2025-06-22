# Use an official Node runtime as the base image
FROM node:22-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Python, make, g++, and any needed packages specified in package.json
RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python
RUN npm install
# Bundle the source code inside the Docker image
COPY . .

# Build the TypeScript code
RUN npm run build

# Start the application
CMD ["node", "/app/dist/voiceMemosAutomation/index.js"]