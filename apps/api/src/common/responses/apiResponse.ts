import type { Response } from "express";
import type { ErrorDetails } from "../errors/AppError";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta: {
    requestId: string;
    correlationId: string;
    timestamp: string;
  };
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    category: string;
    message: string;
    retryable: boolean;
    details?: ErrorDetails | undefined;
    stack?: string | undefined;
  };
  meta: {
    requestId: string;
    correlationId: string;
    timestamp: string;
  };
};

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response<ApiSuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      requestId: res.locals.requestId ?? "unknown",
      correlationId: res.locals.correlationId ?? res.locals.requestId ?? "unknown",
      timestamp: new Date().toISOString()
    }
  });
}
