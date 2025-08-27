export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn', 
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose'
}

export interface LogContext {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  duration?: number;
  statusCode?: number;
  error?: Error;
  [key: string]: any;
}

export interface ILogger {
  error(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  verbose(message: string, context?: LogContext): void;
}
