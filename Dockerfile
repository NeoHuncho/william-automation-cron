# Use an official Node runtime as the base image
FROM node:alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Python, make, g++, and any needed packages specified in package.json
RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python
RUN npm install

# Install any needed packages specified in package.json
RUN npm install

# Bundle the source code inside the Docker image
COPY . .

# Build the TypeScript code
RUN npm run build

# Install cron and set up the cron job
RUN apt-get update && apt-get install -y cron
RUN echo "0 4 * * * /app/run.sh" > /etc/crontabs/root

# Start cron in the foreground
CMD ["cron", "-f"]