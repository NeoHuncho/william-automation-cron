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
RUN touch /var/log/cron.log

# Add crontab file
COPY crontab /etc/crontabs/root

# Start cron and tail logs
CMD crond && tail -f /var/log/cron.log