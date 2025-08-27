import { ValidationError } from "elysia";
import { DatabaseError, LogicError, NotFoundError } from "../../domain/errors/customErrors";

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export class ResponseFormatter {
  static success<T>(data: T, message: string): SuccessResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  static handleError(error: string, details?: string): ErrorResponse {
    return {
      success: false,
      error,
      details,
    };
  }

  static error(error: unknown, defaultMessage: string): ErrorResponse {
    if (error instanceof ValidationError) {
      return this.handleError("Validation Error", error.message);
    }
    if (error instanceof NotFoundError) {
      return this.handleError("Not Found", error.message);
    }

    if (error instanceof LogicError) {
      return this.handleError("Logic Error", error.message);
    }

    if (error instanceof DatabaseError) {
      return this.handleError("Database Error", error.message);
    }

    const details = error instanceof Error ? error.message : "Unknown error";
    return this.handleError(defaultMessage, details);
  }
}
