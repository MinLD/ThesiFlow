import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { getHealth } from "../src/modules/health/health.controller";
import { getHealthStatus } from "../src/modules/health/health.service";

function createMockResponse(requestId = "test-request-1234") {
  const res = {
    locals: { requestId },
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  } as unknown as Response;

  return res;
}

describe("health module", () => {
  it("service returns health DTO", () => {
    const health = getHealthStatus();

    expect(health.status).toBe("ok");
    expect(health.service).toBe("api");
    expect(health.timestamp).toEqual(expect.any(String));
  });

  it("controller returns formatted health response", () => {
    const req = {} as Request;
    const res = createMockResponse();
    const next = vi.fn();

    getHealth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          status: "ok",
          service: "api",
          timestamp: expect.any(String)
        }),
        meta: expect.objectContaining({
          requestId: "test-request-1234",
          timestamp: expect.any(String)
        })
      })
    );
  });
});
