import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const validEnv = {
  NODE_ENV: "test",
  PORT: "4000",
  DATABASE_URL: "postgresql://thesiflow:thesiflow_dev_password@localhost:5432/thesiflow?schema=public",
  FRONTEND_URL: "http://localhost:3000",
  CORS_ORIGIN: "http://localhost:3000",
  JSON_BODY_LIMIT: "1mb",
  RATE_LIMIT_WINDOW_MS: "60000",
  RATE_LIMIT_MAX: "100",
  LOG_LEVEL: "info"
};

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.stubEnv("NODE_ENV", validEnv.NODE_ENV);
  vi.stubEnv("PORT", validEnv.PORT);
  vi.stubEnv("DATABASE_URL", validEnv.DATABASE_URL);
  vi.stubEnv("FRONTEND_URL", validEnv.FRONTEND_URL);
  vi.stubEnv("CORS_ORIGIN", validEnv.CORS_ORIGIN);
  vi.stubEnv("JSON_BODY_LIMIT", validEnv.JSON_BODY_LIMIT);
  vi.stubEnv("RATE_LIMIT_WINDOW_MS", validEnv.RATE_LIMIT_WINDOW_MS);
  vi.stubEnv("RATE_LIMIT_MAX", validEnv.RATE_LIMIT_MAX);
  vi.stubEnv("LOG_LEVEL", validEnv.LOG_LEVEL);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("parseEnv", () => {
  it("parses valid environment values", async () => {
    const { parseEnv } = await import("../src/config/env");
    const env = parseEnv(validEnv);

    expect(env.NODE_ENV).toBe("test");
    expect(env.PORT).toBe(4000);
    expect(env.RATE_LIMIT_MAX).toBe(100);
  });

  it("fails fast when DATABASE_URL is missing", async () => {
    const { parseEnv } = await import("../src/config/env");
    const { DATABASE_URL: _databaseUrl, ...missingDatabaseUrl } = validEnv;

    expect(() => parseEnv(missingDatabaseUrl)).toThrow("ENV_VALIDATION_ERROR");
  });

  it("rejects non-PostgreSQL DATABASE_URL", async () => {
    const { parseEnv } = await import("../src/config/env");

    expect(() => parseEnv({ ...validEnv, DATABASE_URL: "mysql://localhost:3306/app" })).toThrow(
      "ENV_VALIDATION_ERROR"
    );
  });
});
