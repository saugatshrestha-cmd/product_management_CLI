import winston from 'winston';
import { Request, Response } from 'express';

interface LoggerOptions {
  console?: boolean;
  level?: string;
  colorize?: boolean;
  showTimestamp?: boolean;
}

class CustomLogger {
  private logger: winston.Logger;

  constructor(options: LoggerOptions = {}) {
    const formatters = [];

    if (options.showTimestamp !== false) {
      formatters.push(winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }));
    }

    if (options.colorize !== false && process.env.NODE_ENV !== 'production') {
      formatters.push(winston.format.colorize());
    }

    formatters.push(winston.format.printf(({ timestamp, level, message, ...metadata }) => {
      const metaStr = Object.keys(metadata).length
        ? '\n' + Object.entries(metadata)
            .map(([key, val]) => `  ${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}`)
            .join('\n')
        : '';
      
      return `${timestamp} [${level}] ${message}${metaStr}`;
    }));

    this.logger = winston.createLogger({
      level: options.level || 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(...formatters)
        })
      ]
    });
  }

  logRequest(req: Request) {
    this.logger.info(`[${req.method}] ${req.originalUrl} - Started`, {
      headers: {
        'user-agent': req.headers['user-agent'],
        referer: req.headers.referer
      }
    });
  }

  logResponse(req: Request, res: Response) {
  const isError = res.statusCode >= 400;
  const logMessage = `[${req.method}] ${req.originalUrl} - ${isError ? 'Failed' : 'Completed'}`;

  const logPayload = {
    status: res.statusCode,
    ...(isError && { body: res.locals.responseBody }),
  };

  if (isError) {
    this.logger.error(logMessage, logPayload);
  } else {
    this.logger.info(logMessage, logPayload);
  }
}

  error(message: string, meta?: any) {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }
}

export const logger = new CustomLogger({
  level: process.env.LOG_LEVEL || 'info',
  colorize: process.env.NODE_ENV !== 'production',
  showTimestamp: true
});