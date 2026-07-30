import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "../../config/env";

const allowedOrigins = new Set([
  env.FRONTEND_URL,
  ...(env.NODE_ENV === "production" ? [] : ["http://localhost:3000", "http://localhost:3001"]),
  ...env.CORS_ORIGIN.split(/[|,]+/).map((origin) => origin.trim()).filter(Boolean)
]);

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

    callback(new Error("CORS origin is not allowed"));
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
