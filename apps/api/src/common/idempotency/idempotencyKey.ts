import { AppError } from "../errors/AppError";

const idempotencyKeyPattern = /^[a-zA-Z0-9._:-]{8,128}$/;

export function requireIdempotencyKey(value: unknown): string {
  if (typeof value === "string" && idempotencyKeyPattern.test(value)) {
    return value;
  }

  throw new AppError(400, "INVALID_IDEMPOTENCY_KEY", "Idempotency-Key must be 8-128 URL-safe characters");
}
