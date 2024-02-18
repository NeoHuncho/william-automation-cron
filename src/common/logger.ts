import winston from 'winston';
import LokiTransport from 'winston-loki';

export let logger: winston.Logger | null = null;

export const initLogger = () => {
  const transports: winston.transport[] = [
    new LokiTransport({
      host: process.env.HOST_LOKI,
      labels: { job: 'voiceMemoAutomation' },
    }),
  ];

  if (process.env.NODE_ENV !== 'production') {
    transports.push(new winston.transports.Console());
  }

  logger = winston.createLogger({ transports });
};
