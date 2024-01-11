FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Install cron and setup logfile
RUN apk add --no-cache dcron logrotate

# Add crontab file
COPY crontab /etc/crontabs/root

# Copy start script
COPY start.sh .
RUN chmod +x start.sh

# Start cron, create and tail logs
CMD ["./start.sh"]