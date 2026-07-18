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
  vi.stubEnv("LOG_LEVEL", "error");
});

describe("security middleware", () => {
  it("allows configured CORS origin", async () => {
    const { corsMiddleware } = await import("../src/common/middleware/security");

    const req = { headers: { origin: "http://localhost:3000" } };
    const headers = new Map<string, string>();
    const res = {
      setHeader: (name: string, value: string) => {
        headers.set(name.toLowerCase(), value);
      },
      getHeader: (name: string) => headers.get(name.toLowerCase())
    };
    let allowed = false;

    await new Promise<void>((resolve, reject) => {
      corsMiddleware(req as never, res as never, (error?: unknown) => {
        if (error) {
          reject(error);
          return;
        }

        allowed = true;
        resolve();
      });
    });

    expect(allowed).toBe(true);
    expect(headers.get("access-control-allow-origin")).toBe("http://localhost:3000");
  });

  it("rejects unlisted CORS origin", async () => {
    const { corsMiddleware } = await import("../src/common/middleware/security");

    const req = { headers: { origin: "http://evil.example" } };
    const res = {};

    await expect(
      new Promise<void>((resolve, reject) => {
        corsMiddleware(req as never, res as never, (error?: unknown) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      })
    ).rejects.toThrow("CORS origin is not allowed");
  });
});
