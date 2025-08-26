export interface SuccessResponse<T>{
    success: true;
    data: T;
    message: string;
}

export interface ErrorResponse{
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

    static handlerError(error: string, details?: string): ErrorResponse {
        return {
            success: false,
            error,
            details,
        };
    }

    static error(error: unknown, defaultMessage: string): ErrorResponse {
        const details = error instanceof Error ? error.message : "Unknown error";
        return this.handlerError(defaultMessage, details);
    }
}