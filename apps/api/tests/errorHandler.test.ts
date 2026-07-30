import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("PORT", "4000");
  vi.stubEnv("DATABASE_URL", "postgresql://thesiflow:thesiflow_dev_password@localhost:5432/thesiflow?schema=public");
  vi.stubEnv("FRONTEND_URL", "http://localhost:3000");
  vi.stubEnv("CORS_ORIGIN", "http://localhost:3000");
  vi.stubEnv("JSON_BODY_LIMIT", "1mb");
  vi.stubEnv("RATE_LIMIT_WINDOW_MS", "60000");
  vi.stubEnv("RATE_LIMIT_MAX", "100");
  vi.stubEnv("LOG_LEVEL", "info");
});

describe("formatError", () => {
  it("keeps AppError message and code", async () => {
    const { AppError } = await import("../src/common/errors/AppError");
    const { formatError } = await import("../src/common/middleware/errorHandler");
    const error = formatError(new AppError(404, "NOT_FOUND", "Missing resource"), "production");

    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("Missing resource");
  });

  it("hides unknown error details in production", async () => {
    const { formatError } = await import("../src/common/middleware/errorHandler");
    const error = formatError(new Error("Raw database password leaked here"), "production");

    expect(error.statusCode).toBe(500);
    expect(error.code).toBe("INTERNAL_ERROR");
    expect(error.message).toBe("Unexpected server error");
    expect(error.stack).toBeUndefined();
  });
});
