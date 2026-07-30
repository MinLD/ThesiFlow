# Phase 1 Code

## Session Rule

Khi bắt đầu session mới, AI phải đọc theo thứ tự:

1. `docs/BaoCaoKhoaLuan.docx`
2. `docs/ROADMAP.md`
3. File PLAN của Current Phase
4. File CODE của Current Phase
5. Repository hiện tại

Sau khi đọc: xác định Current Phase, Current Task, task cuối cùng đã hoàn thành, code cuối cùng đã viết, code đã áp dụng runtime hay chưa; không làm lại task đã hoàn thành; tiếp tục đúng Next Exact Action; cuối session cập nhật lại `docs/ROADMAP.md`, PLAN và CODE. Không chỉ tin Markdown; phải kiểm tra repository trước khi viết tiếp.

## Current Progress

- Current Batch: P1-005
- Last Completed Batch: P1-004 draft completed in Markdown only
- Next Batch: P1-005
- Runtime Applied: NO
- Test Executed: NO
- Code Draft Completed: P1-001, P1-002, P1-003, P1-004
- Next Exact Action: Write P1-005 `DRAFT_NOT_APPLIED` logging redaction code; do not edit runtime source until implementation mode is explicitly approved.

## Global Draft Rules

- All code in this file is `DRAFT_NOT_APPLIED`.
- Target paths are exact repository paths.
- Do not apply runtime code unless user explicitly switches to implementation mode.
- Do not add Phase 2+ auth/tenant/RBAC/domain UI in Phase 1.
- Do not add NestJS, microservices, Redis/BullMQ, Kafka/NATS, Kubernetes, Search or AI/RAG.

## P1-001 — Repository/Foundation Reconciliation

### Status

CODE_DRAFT_DONE

### Mục tiêu

Record current repository reality before runtime edits. Separate Phase 1 foundation assets from out-of-phase auth/tenant/RBAC scaffold.

### Target Files

- Modify: `docs/phases/phase-1/PHASE_1_PLAN.md`

### Dependencies

- No new dependency.
- Uses shell inspection commands only.

### Code

````markdown
<!-- DRAFT_NOT_APPLIED -->
<!-- Task: P1-001 -->
<!-- Target: docs/phases/phase-1/PHASE_1_PLAN.md -->
<!-- Action: MODIFY -->

# Phase 1 Repository/Foundation Reconciliation

## Purpose

Verify repository reality before applying Phase 1 runtime changes.

## Source References

- `docs/BaoCaoKhoaLuan.docx`, Chương 7.1, Phase 1: Foundation, monorepo, PostgreSQL, worker, outbox và test foundation.
- `docs/ROADMAP.md`
- `docs/phases/phase-1/PHASE_1_PLAN.md`

## Repository Snapshot

| Area | Observed Path | Phase 1 Classification | Action |
|---|---|---|---|
| npm workspaces | `package.json` with `apps/api`, `apps/web`, `apps/worker` | Phase 1 foundation | Keep and validate. |
| API runtime | `apps/api/src/app.ts` | Phase 1 foundation | Keep; tighten contracts only. |
| Request ID | `apps/api/src/common/middleware/requestId.ts` | Phase 1 foundation | Add correlation ID only if tests require. |
| Error handler | `apps/api/src/common/middleware/errorHandler.ts` | Phase 1 foundation | Align envelope with baseline. |
| Logger | `apps/api/src/common/logger/logger.ts` | Phase 1 foundation | Verify redaction; extend only if test fails. |
| Health/readiness/meta | `apps/api/src/modules/health/*` | Phase 1 foundation | Keep; test no secret leak. |
| Prisma foundation tables | `SystemConfiguration`, `IdempotencyRecord`, `OutboxEvent` | Phase 1 foundation | Validate constraints and migration status. |
| Worker | `apps/worker/src/index.ts` | Phase 1 foundation | Keep worker as separate process; no aggregate ownership. |
| Web shell | `apps/web/src/app/*`, `apps/web/src/features/health/*` | Phase 1 foundation | Keep foundation-only. |
| Auth module | `apps/api/src/modules/auth/*`, `apps/api/src/common/auth/*` | Phase 2+ scaffold | Do not extend in Phase 1. |
| Tenant/RBAC schema | `Tenant`, `User`, `Role`, `UserRole`, `RefreshToken` models | Phase 2–4 scaffold | Do not rely on as final model; reconcile later. |
| Audit schema | `AuditLog` model with tenant relation | Phase 13/domain support scaffold | Use only minimal audit contract in Phase 1. |

## Forbidden Phase 1 Extensions

- No new login/register/session endpoint.
- No organization onboarding.
- No RBAC assignment API.
- No academic/project/document/review domain workflow.
- No direct upload, Search, AI/RAG.

## Validation Commands To Run When Applied

```bash
git status --short
rg --files -g '!node_modules' -g '!dist' -g '!apps/web/.next'
rg -n 'model (SystemConfiguration|IdempotencyRecord|OutboxEvent|Tenant|User|Role|UserRole|RefreshToken|AuditLog)' apps/api/prisma/schema.prisma
```

## Result Template

- Runtime Applied: YES
- Test Executed: inspection only
- Result: PASS/FAIL
- Notes:
````

### Test Code

No test file. This is an evidence Markdown artifact.

### Validation cần chạy sau khi áp dụng

```bash
test -s docs/phases/phase-1/PHASE_1_PLAN.md
rg -n "Repository Reality Check|Phase 2\+ scaffold|Phase 1 foundation" docs/phases/phase-1/PHASE_1_PLAN.md
```

### Kết quả hiện tại

- Code Draft: DONE
- Runtime Applied: NO
- Test Executed: NO
- Next Action: P1-002

## P1-002 — Workspace and Validation Baseline

### Status

CODE_DRAFT_DONE

### Mục tiêu

Add one minimal root validation script for Phase 1 checks. No dependency added.

### Target Files

- Modify: `package.json`

### Dependencies

- Existing npm workspaces only.

### Code

```diff
# DRAFT_NOT_APPLIED
# Task: P1-002
# Target: package.json
# Action: MODIFY
# Dependency: none

--- a/package.json
+++ b/package.json
@@
   "scripts": {
     "dev": "npm run dev --workspaces --if-present",
     "lint": "npm run lint --workspaces --if-present",
     "typecheck": "npm run typecheck --workspaces --if-present",
     "test": "npm run test --workspace apps/api",
     "build": "npm run build --workspaces --if-present",
     "db:validate": "npm run prisma:validate --workspace apps/api",
     "db:migrate": "npm run prisma:migrate --workspace apps/api",
-    "db:seed": "npm run prisma:seed --workspace apps/api"
+    "db:seed": "npm run prisma:seed --workspace apps/api",
+    "phase1:check": "npm run db:validate && npm run typecheck && npm run lint && npm run test"
   },
```

### Test Code

No test file. Script-only change.

### Validation cần chạy sau khi áp dụng

```bash
npm run phase1:check
```

### Kết quả hiện tại

- Code Draft: DONE
- Runtime Applied: NO
- Test Executed: NO
- Next Action: P1-003

## P1-003 — Configuration Validation

### Status

CODE_DRAFT_DONE

### Mục tiêu

Make API env validation explicit, testable, and safe. Do not leak secret values in validation errors.

### Target Files

- Modify: `apps/api/src/config/env.ts`
- Modify: `apps/api/tests/env.test.ts`
- Modify: `.env.example`

### Dependencies

- Existing `zod`.
- Existing `vitest`.

### Code

```typescript
// DRAFT_NOT_APPLIED
// Task: P1-003
// Target: apps/api/src/config/env.ts
// Action: MODIFY
// Dependency: zod, dotenv

import "dotenv/config";
import { z } from "zod";

const secretSchema = z.string().min(32, "must be at least 32 characters");
const postgresUrlSchema = z
  .string()
  .min(1, "DATABASE_URL is required")
  .refine((value) => value.startsWith("postgresql://") || value.startsWith("postgres://"), {
    message: "DATABASE_URL must be a PostgreSQL connection string"
  });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: postgresUrlSchema,
  FRONTEND_URL: z.string().url(),
  CORS_ORIGIN: z.string().min(1),
  JSON_BODY_LIMIT: z.string().min(1).default("1mb"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  ACCESS_TOKEN_SECRET: secretSchema,
  REFRESH_TOKEN_SECRET: secretSchema,
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
  REFRESH_TOKEN_COOKIE_NAME: z.string().min(1).default("refresh_token"),
  COOKIE_SECURE: z.coerce.boolean().default(false),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(12),
  APP_VERSION: z.string().min(1).default("0.1.0"),
  OUTBOX_CLAIM_LIMIT: z.coerce.number().int().positive().default(10),
  WORKER_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(5_000)
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const fields = Object.keys(result.error.flatten().fieldErrors).sort();
    throw new Error(`ENV_VALIDATION_ERROR: ${fields.join(",")}`);
  }

  return result.data;
}

export const env = parseEnv(process.env);
```

```typescript
// DRAFT_NOT_APPLIED
// Task: P1-003
// Target: apps/api/tests/env.test.ts
// Action: MODIFY
// Dependency: vitest

import { describe, expect, it } from "vitest";
import { parseEnv } from "../src/config/env";

const validEnv = {
  NODE_ENV: "test",
  PORT: "4000",
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5433/thesiflow_test",
  FRONTEND_URL: "http://localhost:3000",
  CORS_ORIGIN: "http://localhost:3000",
  ACCESS_TOKEN_SECRET: "a".repeat(32),
  REFRESH_TOKEN_SECRET: "b".repeat(32),
  ADMIN_EMAIL: "admin@example.edu",
  ADMIN_PASSWORD: "correct-horse-battery"
} satisfies NodeJS.ProcessEnv;

describe("parseEnv", () => {
  it("accepts a valid test env", () => {
    expect(parseEnv(validEnv).DATABASE_URL).toContain("postgresql://");
  });

  it("rejects missing PostgreSQL URL without leaking secret values", () => {
    expect(() => parseEnv({ ...validEnv, DATABASE_URL: "", ACCESS_TOKEN_SECRET: "super-secret-value-that-must-not-appear" })).toThrow(
      /ENV_VALIDATION_ERROR: DATABASE_URL,ACCESS_TOKEN_SECRET/
    );
  });

  it("rejects short secrets", () => {
    expect(() => parseEnv({ ...validEnv, ACCESS_TOKEN_SECRET: "short" })).toThrow(/ACCESS_TOKEN_SECRET/);
  });
});
```

```dotenv
# DRAFT_NOT_APPLIED
# Task: P1-003
# Target: .env.example
# Action: MODIFY

NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/thesiflow
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
JSON_BODY_LIMIT=1mb
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
LOG_LEVEL=info
ACCESS_TOKEN_SECRET=replace-with-at-least-32-characters
REFRESH_TOKEN_SECRET=replace-with-at-least-32-characters
ACCESS_TOKEN_TTL_SECONDS=900
REFRESH_TOKEN_TTL_DAYS=30
REFRESH_TOKEN_COOKIE_NAME=refresh_token
COOKIE_SECURE=false
ADMIN_EMAIL=admin@example.edu
ADMIN_PASSWORD=replace-with-12-plus-characters
APP_VERSION=0.1.0
OUTBOX_CLAIM_LIMIT=10
WORKER_POLL_INTERVAL_MS=5000
```

### Test Code

Included above: `apps/api/tests/env.test.ts`.

### Validation cần chạy sau khi áp dụng

```bash
npm run test --workspace apps/api -- env.test.ts
npm run typecheck --workspace apps/api
```

### Kết quả hiện tại

- Code Draft: DONE
- Runtime Applied: NO
- Test Executed: NO
- Next Action: P1-004

## P1-004 — Request Context and Error Envelope

### Status

CODE_DRAFT_DONE

### Mục tiêu

Add safe request/correlation context and a stable error envelope for all Phase 1+ APIs.

### Target Files

- Modify: `apps/api/src/common/middleware/requestId.ts`
- Modify: `apps/api/src/common/types/express.d.ts`
- Modify: `apps/api/src/common/responses/apiResponse.ts`
- Modify: `apps/api/src/common/middleware/errorHandler.ts`
- Modify: `apps/api/tests/requestId.test.ts`
- Modify: `apps/api/tests/errorHandler.test.ts`

### Dependencies

- Existing `express`
- Existing `zod`
- Existing `vitest`
- Existing `supertest`
- No new dependency

### Code

```typescript
// DRAFT_NOT_APPLIED
// Task: P1-004
// Target: apps/api/src/common/middleware/requestId.ts
// Action: MODIFY
// Dependency: node:crypto, express

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
```

```typescript
// DRAFT_NOT_APPLIED
// Task: P1-004
// Target: apps/api/src/common/types/express.d.ts
// Action: MODIFY
// Dependency: express-serve-static-core

import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    requestId: string;
    correlationId: string;
  }
}
```

```typescript
// DRAFT_NOT_APPLIED
// Task: P1-004
// Target: apps/api/src/common/responses/apiResponse.ts
// Action: MODIFY
// Dependency: express

import type { Response } from "express";
import type { ErrorDetails } from "../errors/AppError";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta: {
    requestId: string;
    correlationId: string;
    timestamp: string;
  };
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    category: string;
    message: string;
    retryable: boolean;
    details?: ErrorDetails | undefined;
    stack?: string | undefined;
  };
  meta: {
    requestId: string;
    correlationId: string;
    timestamp: string;
  };
};

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response<ApiSuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      requestId: res.locals.requestId ?? "unknown",
      correlationId: res.locals.correlationId ?? res.locals.requestId ?? "unknown",
      timestamp: new Date().toISOString()
    }
  });
}
```

```typescript
// DRAFT_NOT_APPLIED
// Task: P1-004
// Target: apps/api/src/common/middleware/errorHandler.ts
// Action: MODIFY
// Dependency: express, zod

import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../../config/env";
import { AppError, type ErrorDetails } from "../errors/AppError";
import { logger } from "../logger/logger";
import type { ApiErrorResponse } from "../responses/apiResponse";

type ErrorCategory = "VALIDATION" | "AUTHENTICATION" | "AUTHORIZATION" | "NOT_FOUND" | "CONFLICT" | "RATE_LIMIT" | "INTERNAL";

type FormattedError = {
  statusCode: number;
  code: string;
  category: ErrorCategory;
  message: string;
  retryable: boolean;
  details?: ErrorDetails | undefined;
  stack?: string | undefined;
};

function categoryFromStatus(statusCode: number): ErrorCategory {
  if (statusCode === 400 || statusCode === 422) return "VALIDATION";
  if (statusCode === 401) return "AUTHENTICATION";
  if (statusCode === 403) return "AUTHORIZATION";
  if (statusCode === 404) return "NOT_FOUND";
  if (statusCode === 409) return "CONFLICT";
  if (statusCode === 429) return "RATE_LIMIT";
  return "INTERNAL";
}

function retryableFromStatus(statusCode: number): boolean {
  return statusCode === 408 || statusCode === 429 || statusCode >= 500;
}

export function formatError(error: unknown, environment: "development" | "test" | "production"): FormattedError {
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      category: "VALIDATION",
      message: "Request validation failed",
      retryable: false,
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    };
  }

  if (error instanceof AppError) {
    const formatted: FormattedError = {
      statusCode: error.statusCode,
      code: error.code,
      category: categoryFromStatus(error.statusCode),
      message: error.message,
      retryable: retryableFromStatus(error.statusCode),
      details: error.details
    };

    if (environment !== "production") {
      formatted.stack = error.stack;
    }

    return formatted;
  }

  if (environment === "production") {
    return {
      statusCode: 500,
      code: "INTERNAL_ERROR",
      category: "INTERNAL",
      message: "Unexpected server error",
      retryable: true
    };
  }

  const unknownError = error instanceof Error ? error : new Error("Unknown error");

  return {
    statusCode: 500,
    code: "INTERNAL_ERROR",
    category: "INTERNAL",
    message: unknownError.message,
    retryable: true,
    stack: unknownError.stack
  };
}

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const formatted = formatError(error, env.NODE_ENV);
  const requestId = res.locals.requestId ?? req.requestId ?? "unknown";
  const correlationId = res.locals.correlationId ?? req.correlationId ?? requestId;

  logger.error("Request failed", {
    requestId,
    correlationId,
    method: req.method,
    path: req.originalUrl,
    statusCode: formatted.statusCode,
    code: formatted.code,
    category: formatted.category,
    errorType: error instanceof Error ? error.name : typeof error
  });

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: formatted.code,
      category: formatted.category,
      message: formatted.message,
      retryable: formatted.retryable,
      details: formatted.details,
      stack: formatted.stack
    },
    meta: {
      requestId,
      correlationId,
      timestamp: new Date().toISOString()
    }
  };

  res.status(formatted.statusCode).json(response);
};
```

### Test Code

```typescript
// DRAFT_NOT_APPLIED
// Task: P1-004
// Target: apps/api/tests/requestId.test.ts
// Action: MODIFY
// Dependency: vitest, express types

import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { requestIdMiddleware } from "../src/common/middleware/requestId";

function runMiddleware(headersInput: Record<string, string | undefined> = {}) {
  const headers = new Map<string, string>();
  const req = {
    header: (name: string) => headersInput[name.toLowerCase()]
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
  it("echoes a valid incoming request ID and uses it as correlation ID by default", () => {
    const { req, res, next, headers } = runMiddleware({ "x-request-id": "test-request-1234" });

    expect(req.requestId).toBe("test-request-1234");
    expect(req.correlationId).toBe("test-request-1234");
    expect(res.locals.requestId).toBe("test-request-1234");
    expect(res.locals.correlationId).toBe("test-request-1234");
    expect(headers.get("x-request-id")).toBe("test-request-1234");
    expect(headers.get("x-correlation-id")).toBe("test-request-1234");
    expect(next).toHaveBeenCalledOnce();
  });

  it("echoes a separate valid correlation ID", () => {
    const { req, res, headers } = runMiddleware({
      "x-request-id": "test-request-1234",
      "x-correlation-id": "test-correlation-5678"
    });

    expect(req.requestId).toBe("test-request-1234");
    expect(req.correlationId).toBe("test-correlation-5678");
    expect(res.locals.correlationId).toBe("test-correlation-5678");
    expect(headers.get("x-correlation-id")).toBe("test-correlation-5678");
  });

  it("generates safe IDs when headers are missing", () => {
    const { req, res, next, headers } = runMiddleware();

    expect(req.requestId).toEqual(expect.any(String));
    expect(req.correlationId).toBe(req.requestId);
    expect(res.locals.requestId).toBe(req.requestId);
    expect(res.locals.correlationId).toBe(req.requestId);
    expect(headers.get("x-request-id")).toBe(req.requestId);
    expect(headers.get("x-correlation-id")).toBe(req.requestId);
    expect(next).toHaveBeenCalledOnce();
  });

  it("rejects unsafe incoming IDs", () => {
    const { req } = runMiddleware({
      "x-request-id": "bad header with spaces",
      "x-correlation-id": "bad\nheader"
    });

    expect(req.requestId).not.toBe("bad header with spaces");
    expect(req.correlationId).toBe(req.requestId);
  });
});
```

```typescript
// DRAFT_NOT_APPLIED
// Task: P1-004
// Target: apps/api/tests/errorHandler.test.ts
// Action: MODIFY
// Dependency: vitest, supertest

import request from "supertest";
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
  vi.stubEnv("ACCESS_TOKEN_SECRET", "a".repeat(32));
  vi.stubEnv("REFRESH_TOKEN_SECRET", "b".repeat(32));
  vi.stubEnv("ADMIN_EMAIL", "admin@example.edu");
  vi.stubEnv("ADMIN_PASSWORD", "correct-horse-battery");
});

describe("formatError", () => {
  it("keeps AppError message, category and retryable flag", async () => {
    const { AppError } = await import("../src/common/errors/AppError");
    const { formatError } = await import("../src/common/middleware/errorHandler");
    const error = formatError(new AppError(404, "NOT_FOUND", "Missing resource"), "production");

    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
    expect(error.category).toBe("NOT_FOUND");
    expect(error.message).toBe("Missing resource");
    expect(error.retryable).toBe(false);
  });

  it("marks server errors retryable and hides unknown production details", async () => {
    const { formatError } = await import("../src/common/middleware/errorHandler");
    const error = formatError(new Error("Raw database password leaked here"), "production");

    expect(error.statusCode).toBe(500);
    expect(error.code).toBe("INTERNAL_ERROR");
    expect(error.category).toBe("INTERNAL");
    expect(error.message).toBe("Unexpected server error");
    expect(error.retryable).toBe(true);
    expect(error.stack).toBeUndefined();
  });
});

describe("errorHandler", () => {
  it("returns stable request metadata in the error envelope", async () => {
    const { createApp } = await import("../src/app");
    const response = await request(createApp())
      .get("/__test/error")
      .set("x-request-id", "test-request-1234")
      .set("x-correlation-id", "test-correlation-5678")
      .expect(500);

    expect(response.headers["x-request-id"]).toBe("test-request-1234");
    expect(response.headers["x-correlation-id"]).toBe("test-correlation-5678");
    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        category: "INTERNAL",
        message: "Raw test stack marker",
        retryable: true
      },
      meta: {
        requestId: "test-request-1234",
        correlationId: "test-correlation-5678"
      }
    });
  });
});
```

### Validation cần chạy sau khi áp dụng

```bash
npm run test --workspace apps/api -- requestId.test.ts errorHandler.test.ts
npm run typecheck --workspace apps/api
```

### Kết quả hiện tại

- Code Draft: DONE
- Runtime Applied: NO
- Test Executed: NO
- Next Action: P1-005

## Latest Session Log

- Time: 2026-07-30 Asia/Ho_Chi_Minh
- Executor: Codex CLI
- Work Performed: Created Markdown-only code batches P1-001..P1-004; P1-004 adds request/correlation context, stable error envelope, response metadata and tests as `DRAFT_NOT_APPLIED`.
- Runtime Code Changed: NO
- Test Executed: NO
- Task Completed: P1-004 — Request Context and Error Envelope code draft.
- Current Task: P1-005 — Logging Redaction.
- Runtime Applied: NO.
- Test Executed: NO.
- Next Exact Action: Write P1-005 `DRAFT_NOT_APPLIED` logging redaction code; do not edit runtime source until implementation mode is explicitly approved.
