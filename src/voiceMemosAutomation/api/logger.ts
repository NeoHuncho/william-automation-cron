import winston from 'winston';
import LokiTransport from 'winston-loki';

export const logger = () =>
  winston.createLogger({
    transports: [
      new LokiTransport({
        host: process.env.HOST_LOKI,
        labels: { job: 'voiceMemoAutomation' },
      }),
    ],
  });
