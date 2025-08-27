import type { ILogger, LogContext } from '../logging/ILogger';
import { randomUUID } from 'crypto';

export class RequestLogger {
  constructor(private readonly logger: ILogger) {}

  logRequest(method: string, url: string, ip?: string, userAgent?: string): string {
    const requestId = randomUUID();
    const context: LogContext = {
      requestId,
      method,
      endpoint: url,
      ip,
      userAgent
    };

    this.logger.info('Incoming request', context);
    return requestId;
  }

  logResponse(
    requestId: string, 
    statusCode: number, 
    duration: number, 
    userId?: string
  ): void {
    const context: LogContext = {
      requestId,
      statusCode,
      duration,
      userId
    };

    if (statusCode >= 400) {
      this.logger.warn('Request completed with error', context);
    } else {
      this.logger.info('Request completed successfully', context);
    }
  }

  logError(
    requestId: string, 
    error: Error, 
    method?: string, 
    endpoint?: string,
    userId?: string
  ): void {
    const context: LogContext = {
      requestId,
      error,
      method,
      endpoint,
      userId
    };

    this.logger.error('Request failed with error', context);
  }
}
