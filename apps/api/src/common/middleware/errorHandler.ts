import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../../config/env";
import { AppError, type ErrorDetails } from "../errors/AppError";
import { logger } from "../logger/logger";
import type { ApiErrorResponse } from "../responses/apiResponse";

type FormattedError = {
  statusCode: number;
  code: string;
  message: string;
  details?: ErrorDetails | undefined;
  stack?: string | undefined;
};

export function formatError(error: unknown, environment: "development" | "test" | "production"): FormattedError {
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
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
      message: error.message,
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
      message: "Unexpected server error"
    };
  }

  const unknownError = error instanceof Error ? error : new Error("Unknown error");

  return {
    statusCode: 500,
    code: "INTERNAL_ERROR",
    message: unknownError.message,
    stack: unknownError.stack
  };
}

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const formatted = formatError(error, env.NODE_ENV);

  logger.error("Request failed", {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode: formatted.statusCode,
    code: formatted.code,
    errorType: error instanceof Error ? error.name : typeof error
  });

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: formatted.code,
      message: formatted.message,
      details: formatted.details,
      stack: formatted.stack
    },
    meta: {
      requestId: res.locals.requestId ?? "unknown",
      timestamp: new Date().toISOString()
    }
  };

  res.status(formatted.statusCode).json(response);
};
