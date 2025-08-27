export interface LoggerConfig {
  level: string;
  enableConsole: boolean;
  enableFile: boolean;
  logDirectory: string;
  maxFileSize: string;
  maxFiles: string;
  environment: 'development' | 'staging' | 'production';
}

export const getLoggerConfig = (): LoggerConfig => {
  return {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.LOG_CONSOLE !== 'false',
    enableFile: process.env.LOG_FILE !== 'false',
    logDirectory: process.env.LOG_DIRECTORY || 'logs',
    maxFileSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development'
  };
};
