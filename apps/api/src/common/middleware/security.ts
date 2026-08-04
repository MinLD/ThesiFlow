import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "../../config/env";
import { AppError } from "../errors/AppError";

const allowedOrigins = new Set([
  env.FRONTEND_URL,
  ...(env.NODE_ENV === "production" ? [] : ["http://localhost:3000", "http://localhost:3001"]),
  ...env.CORS_ORIGIN.split(/[|,]+/).map((origin) => origin.trim()).filter(Boolean)
]);

function isOriginAllowed(origin: string): boolean {
  return allowedOrigins.has(origin);
}

export const helmetMiddleware = helmet();

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new AppError(403, "CORS_ORIGIN_DENIED", "CORS origin is not allowed"));
  },
  credentials: true
});

export const jsonBodyParser = express.json({
  limit: env.JSON_BODY_LIMIT
});

export const rateLimitMiddleware = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false
});

export function requireTrustedOrigin(req: Request, _res: Response, next: NextFunction): void {
  const origin = req.get("origin");
  const secFetchSite = req.get("sec-fetch-site");

  if (origin) {
    if (isOriginAllowed(origin)) {
      next();
      return;
    }

    next(new AppError(403, "CSRF_ORIGIN_DENIED", "Origin is not allowed"));
    return;
  }

  if (secFetchSite === "cross-site") {
    next(new AppError(403, "CSRF_ORIGIN_REQUIRED", "Origin is required"));
    return;
  }

  next();
}

function authRateLimit(limit: number) {
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  });
}

export const loginRateLimit = authRateLimit(10);
export const refreshRateLimit = authRateLimit(60);
export const verifyEmailRateLimit = authRateLimit(30);
export const forgotPasswordRateLimit = authRateLimit(5);
export const resetPasswordRateLimit = authRateLimit(10);
