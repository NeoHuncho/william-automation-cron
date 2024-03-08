import { Logger, createLogger, format, transports } from 'winston';
import LokiTransport from 'winston-loki';

export let logger: Logger | null = null;

export const initLogger = () => {
  if (logger) {
    return;
  }

  const loggerTransports = [];

  if (process.env.NODE_ENV === 'production') {
    loggerTransports.push(
      new LokiTransport({
        host: process.env.HOST_LOKI,
        labels: { job: 'voiceMemoAutomation' },
        json: true,
        format: format.json(),
        replaceTimestamp: true,
        onConnectionError: (err) => console.error(err),
      })
    );
  }

  loggerTransports.push(
    new transports.Console({
      format: format.combine(format.simple(), format.colorize()),
    })
  );

  logger = createLogger({
    transports: loggerTransports,
  });
};
