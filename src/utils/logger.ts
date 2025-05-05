import winston from 'winston';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

winston.addColors(colors);

interface LoggerOptions {
    console: boolean;
    level?: string;
}

class CustomLogger {
  private logger: winston.Logger;

  constructor(options: LoggerOptions) {
    const transports: winston.transport[] = [];

    if (options.console) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, ...metadata }) => {
              return `${timestamp} [${level}]: ${message} ${
                Object.keys(metadata).length ? JSON.stringify(metadata) : ''
              }`;
            })
          )
        })
      );
    }

    this.logger = winston.createLogger({
      levels,
      level: options.level || 'info',
      transports,
      exceptionHandlers: [
        new winston.transports.Console()
      ],
      rejectionHandlers: [
        new winston.transports.Console()
      ]
    });
  }

  public log(level: string, message: string, meta?: any): void {
    this.logger.log(level, message, meta);
  }

  public error(message: string, meta?: any): void {
    this.log('error', message, meta);
  }

  public warn(message: string, meta?: any): void {
    this.log('warn', message, meta);
  }

  public info(message: string, meta?: any): void {
    this.log('info', message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.log('debug', message, meta);
  }
}

const logger = new CustomLogger({
  console: true,
  level: process.env.LOG_LEVEL || 'info'
});

export { CustomLogger, logger };