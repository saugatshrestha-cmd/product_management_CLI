import winston from 'winston';


interface LoggerOptions {
    console: boolean;
    level?: string;
    format?: string; 
    colorize?: boolean; 
    showTimestamp?: boolean; 
}

const formatPresets = {
    simple: winston.format.printf(({ level, message }) => {
        return `[${level}]: ${message}`;
    }),
    detailed: winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        return `${timestamp} [${level}]: ${message} ${
            Object.keys(metadata).length ? JSON.stringify(metadata) : ''
        }`;
    }),
    json: winston.format.json(),
    structured: winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        const metaStr = Object.keys(metadata).length 
            ? '\n' + Object.entries(metadata)
                .map(([key, value]) => `  ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
                .join('\n')
            : '';
        return `${timestamp} [${level}] ${message}${metaStr}`;
    }),
};

class CustomLogger {
    private logger: winston.Logger;
    
    constructor(options: LoggerOptions) {
        const formatters = [];
        if (options.colorize !== false) {
            formatters.push(winston.format.colorize());
        }
        if (options.showTimestamp !== false) {
            formatters.push(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }));
        }
        const selectedFormat = options.format && formatPresets[options.format as keyof typeof formatPresets]
            ? formatPresets[options.format as keyof typeof formatPresets]
            : formatPresets.detailed;
        
        formatters.push(selectedFormat);
        
        const transports: winston.transport[] = [];
        
        if (options.console) {
            transports.push(
                new winston.transports.Console({
                    format: winston.format.combine(...formatters)
                })
            );
        }
        
        this.logger = winston.createLogger({
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
    
    public http(message: string, meta?: any): void {
        this.log('http', message, meta);
    }
    
    public debug(message: string, meta?: any): void {
        this.log('debug', message, meta);
    }
}

const logger = new CustomLogger({
    console: true,
    level: process.env.LOG_LEVEL || 'info',
    format: 'structured',
    colorize: process.env.LOG_COLORIZE !== 'false',
    showTimestamp: process.env.LOG_TIMESTAMP !== 'false'
});

export { CustomLogger, logger };