import type { Response } from "express";
import type { ErrorDetails } from "../errors/AppError";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
  };
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetails | undefined;
    stack?: string | undefined;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
};

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response<ApiSuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      requestId: res.locals.requestId ?? "unknown",
      timestamp: new Date().toISOString()
    }
  });
}
