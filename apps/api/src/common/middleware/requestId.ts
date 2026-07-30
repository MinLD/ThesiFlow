import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

const requestIdPattern = /^[a-zA-Z0-9._:-]{8,128}$/;

function normalizeRequestId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return requestIdPattern.test(trimmed) ? trimmed : null;
}

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const incomingRequestId = normalizeRequestId(req.header("x-request-id"));
  const incomingCorrelationId = normalizeRequestId(req.header("x-correlation-id"));
  const requestId = incomingRequestId ?? randomUUID();
  const correlationId = incomingCorrelationId ?? requestId;

  req.requestId = requestId;
  req.correlationId = correlationId;
  res.locals.requestId = requestId;
  res.locals.correlationId = correlationId;
  res.setHeader("x-request-id", requestId);
  res.setHeader("x-correlation-id", correlationId);

  next();
};
