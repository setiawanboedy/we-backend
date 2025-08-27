import winston from 'winston';
import type { ILogger, LogContext } from './ILogger';
import type { LoggerConfig } from './LoggerConfig';

export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor(config: LoggerConfig) {
    this.logger = this.createLogger(config);
  }

  private createLogger(config: LoggerConfig): winston.Logger {
    const transports: winston.transport[] = [];

    if (config.enableConsole) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
              return `${timestamp} [${level}]: ${message}${metaStr}`;
            })
          )
        })
      );
    }

    if (config.enableFile) {
      // All logs
      transports.push(
        new winston.transports.File({
          filename: `${config.logDirectory}/app.log`,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
          maxsize: this.parseSize(config.maxFileSize),
          maxFiles: parseInt(config.maxFiles) || 5
        })
      );

      transports.push(
        new winston.transports.File({
          filename: `${config.logDirectory}/error.log`,
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
          maxsize: this.parseSize(config.maxFileSize),
          maxFiles: parseInt(config.maxFiles) || 5
        })
      );
    }

    return winston.createLogger({
      level: config.level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports,
      exitOnError: false
    });
  }

  private parseSize(size: string): number {
    const sizeRegex = /^(\d+)(k|m|g)?$/i;
    const match = size.match(sizeRegex);
    
    if (!match) return 20 * 1024 * 1024; 
    
    const num = parseInt(match[1] ?? "");
    const unit = match[2]?.toLowerCase();
    
    switch (unit) {
      case 'k': return num * 1024;
      case 'm': return num * 1024 * 1024;
      case 'g': return num * 1024 * 1024 * 1024;
      default: return num;
    }
  }

  private sanitizeContext(context?: LogContext): any {
    if (!context) return {};

    const sanitized = { ...context };
    
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    if (sanitized.error instanceof Error) {
      sanitized.error = {
        name: sanitized.error.name,
        message: sanitized.error.message,
        stack: sanitized.error.stack
      };
    }

    return sanitized;
  }

  error(message: string, context?: LogContext): void {
    this.logger.error(message, this.sanitizeContext(context));
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, this.sanitizeContext(context));
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(message, this.sanitizeContext(context));
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, this.sanitizeContext(context));
  }

  verbose(message: string, context?: LogContext): void {
    this.logger.verbose(message, this.sanitizeContext(context));
  }
}
