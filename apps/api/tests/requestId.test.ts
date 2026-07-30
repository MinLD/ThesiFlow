import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { requestIdMiddleware } from "../src/common/middleware/requestId";

function runMiddleware(incomingRequestId?: string) {
  const headers = new Map<string, string>();
  const req = {
    header: (name: string) => (name.toLowerCase() === "x-request-id" ? incomingRequestId : undefined)
  } as unknown as Request;
  const res = {
    locals: {},
    setHeader: vi.fn((name: string, value: string) => {
      headers.set(name.toLowerCase(), value);
    })
  } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;

  requestIdMiddleware(req, res, next);

  return { req, res, next, headers };
}

describe("requestIdMiddleware", () => {
  it("echoes a valid incoming request ID", () => {
    const { req, res, next, headers } = runMiddleware("test-request-1234");

    expect(req.requestId).toBe("test-request-1234");
    expect(res.locals.requestId).toBe("test-request-1234");
    expect(headers.get("x-request-id")).toBe("test-request-1234");
    expect(next).toHaveBeenCalledOnce();
  });

  it("generates a request ID when missing", () => {
    const { req, res, next, headers } = runMiddleware();

    expect(req.requestId).toEqual(expect.any(String));
    expect(res.locals.requestId).toBe(req.requestId);
    expect(headers.get("x-request-id")).toBe(req.requestId);
    expect(next).toHaveBeenCalledOnce();
  });

  it("generates a request ID when incoming value is unsafe", () => {
    const { req } = runMiddleware("bad header with spaces");

    expect(req.requestId).not.toBe("bad header with spaces");
  });
});
