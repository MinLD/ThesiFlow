import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

const requestIdPattern = /^[a-zA-Z0-9._:-]{8,128}$/;

function normalizeRequestId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return requestIdPattern.test(value) ? value : null;
}

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const incomingRequestId = normalizeRequestId(req.header("x-request-id"));
  const requestId = incomingRequestId ?? randomUUID();

  req.requestId = requestId;
  res.locals.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  next();
};
