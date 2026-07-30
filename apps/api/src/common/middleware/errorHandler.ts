import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../../config/env";
import { AppError, type ErrorDetails } from "../errors/AppError";
import { logger } from "../logger/logger";
import type { ApiErrorResponse } from "../responses/apiResponse";

type ErrorCategory = "VALIDATION" | "AUTHENTICATION" | "AUTHORIZATION" | "NOT_FOUND" | "CONFLICT" | "RATE_LIMIT" | "INTERNAL";

type FormattedError = {
  statusCode: number;
  code: string;
  category: ErrorCategory;
  message: string;
  retryable: boolean;
  details?: ErrorDetails | undefined;
  stack?: string | undefined;
};

function categoryFromStatus(statusCode: number): ErrorCategory {
  if (statusCode === 400 || statusCode === 422) return "VALIDATION";
  if (statusCode === 401) return "AUTHENTICATION";
  if (statusCode === 403) return "AUTHORIZATION";
  if (statusCode === 404) return "NOT_FOUND";
  if (statusCode === 409) return "CONFLICT";
  if (statusCode === 429) return "RATE_LIMIT";
  return "INTERNAL";
}

function retryableFromStatus(statusCode: number): boolean {
  return statusCode === 408 || statusCode === 429 || statusCode >= 500;
}

export function formatError(error: unknown, environment: "development" | "test" | "production"): FormattedError {
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      category: "VALIDATION",
      message: "Request validation failed",
      retryable: false,
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    };
  }

  if (error instanceof AppError) {
    const formatted: FormattedError = {
      statusCode: error.statusCode,
      code: error.code,
      category: categoryFromStatus(error.statusCode),
      message: error.message,
      retryable: retryableFromStatus(error.statusCode),
      details: error.details
    };

    if (environment !== "production") {
      formatted.stack = error.stack;
    }

    return formatted;
  }

  if (environment === "production") {
    return {
      statusCode: 500,
      code: "INTERNAL_ERROR",
      category: "INTERNAL",
      message: "Unexpected server error",
      retryable: true
    };
  }

  const unknownError = error instanceof Error ? error : new Error("Unknown error");

  return {
    statusCode: 500,
    code: "INTERNAL_ERROR",
    category: "INTERNAL",
    message: unknownError.message,
    retryable: true,
    stack: unknownError.stack
  };
}

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const formatted = formatError(error, env.NODE_ENV);
  const requestId = res.locals.requestId ?? req.requestId ?? "unknown";
  const correlationId = res.locals.correlationId ?? req.correlationId ?? requestId;

  logger.error("Request failed", {
    requestId,
    correlationId,
    method: req.method,
    path: req.originalUrl,
    statusCode: formatted.statusCode,
    code: formatted.code,
    category: formatted.category,
    errorType: error instanceof Error ? error.name : typeof error
  });

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: formatted.code,
      category: formatted.category,
      message: formatted.message,
      retryable: formatted.retryable,
      details: formatted.details,
      stack: formatted.stack
    },
    meta: {
      requestId,
      correlationId,
      timestamp: new Date().toISOString()
    }
  };

  res.status(formatted.statusCode).json(response);
};
