import { describe, expect, it } from "vitest";
import { AppError } from "../src/common/errors/AppError";
import { requireIdempotencyKey } from "../src/common/idempotency/idempotencyKey";

describe("requireIdempotencyKey", () => {
  it("accepts stable URL-safe keys", () => {
    expect(requireIdempotencyKey("approval-1234:abc_DEF")).toBe("approval-1234:abc_DEF");
  });

  it("rejects missing or unsafe keys", () => {
    expect(() => requireIdempotencyKey(undefined)).toThrow(AppError);
    expect(() => requireIdempotencyKey("bad key")).toThrow("Idempotency-Key must be 8-128 URL-safe characters");
  });
});
