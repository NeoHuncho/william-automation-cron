# Use an official Node runtime as the base image
FROM node:20-buster-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Python, make, g++, and any needed packages specified in package.json
RUN apt-get update && apt-get install -y python3 make g++ && ln -sf python3 /usr/bin/python
RUN npm install

# Bundle the source code inside the Docker image
COPY . .

# Build the TypeScript code
RUN npm run build

# Install cron and set up the cron job
RUN apt-get install -y cron
RUN echo "0 4 * * * /app/run.sh" > /var/spool/cron/crontabs/root

# Start cron in the foreground
CMD ["cron", "-f"]