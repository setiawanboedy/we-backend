import { WinstonLogger } from './WinstonLogger';
import { getLoggerConfig } from './LoggerConfig';
import type { ILogger } from './ILogger';

class LoggerFactory {
  private static instance: ILogger | null = null;

  static getInstance(): ILogger {
    if (!this.instance) {
      const config = getLoggerConfig();
      this.instance = new WinstonLogger(config);
    }
    return this.instance;
  }

  static createLogger(customConfig?: any): ILogger {
    const config = customConfig || getLoggerConfig();
    return new WinstonLogger(config);
  }
}

export const logger = LoggerFactory.getInstance();
export { LoggerFactory, ILogger };
