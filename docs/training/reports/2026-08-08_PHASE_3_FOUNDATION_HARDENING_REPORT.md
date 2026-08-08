# Phase 3 Foundation Hardening Report

## Summary

Phase 3 foundation hardened before P3-004. Scope stayed on Docker SMTP config, outbox lease/reclaim, worker tests, Prisma version alignment, docs/env cleanup, and API contract drift decision.

## Files changed

- `docker-compose.yml` — API and worker get the same fail-fast SMTP env; both receive `OUTBOX_LOCK_TIMEOUT_MS`.
- `.env.example` — SMTP/outbox variables complete; stray debug command removed.
- `apps/worker/src/index.ts` — stale `processing` reclaim added; publisher injectable for tests; external publish remains outside claim transaction; `SMTP_SECURE=false` parses correctly.
- `apps/worker/tests/outbox-worker.test.ts` — PostgreSQL integration coverage for outbox claim lifecycle.
- `apps/worker/package.json`, `apps/worker/vitest.config.ts`, `apps/worker/vitest.setup.ts` — worker test runner added.
- `package.json`, `apps/api/package.json`, `package-lock.json` — Prisma packages pinned to `7.9.1`.
- `README.md`, `apps/api/src/config/env.ts`, `apps/api/tests/env.test.ts` — duplicate setup tail removed, required SMTP/outbox env documented, boolean env parsing hardened.
- `docs/ROADMAP.md`, `docs/phases/phase-1/PHASE_1_PLAN.md`, `docs/phases/phase-1/PHASE_1_CODE.md`, `docs/phases/phase-3/PHASE_3_PLAN.md`, `docs/phases/phase-3/PHASE_3_CODE.md` — verification and contract drift updated.

## Tests added

- Claim limit: claimed rows do not exceed `OUTBOX_CLAIM_LIMIT`.
- Pending success: `pending` event publishes and clears lock/error.
- Failed retry: `failed` event only retries when `available_at <= now()`.
- Active lock: recent `processing.locked_at` is not reclaimed.
- Stale lock: stale `processing.locked_at` is reclaimed.
- Handler failure: event becomes `failed`, attempts increment, `last_error` stored, retry `available_at` set.
- Concurrency: two concurrent workers do not process the same event.

## Verification

- `npm install` — PASS after sandbox DNS retry outside sandbox.
- `npm run db:validate` — PASS.
- `npm run prisma:generate --workspace apps/api` — PASS.
- `npm run test --workspace apps/worker` — PASS, 1 file / 7 tests.
- `npm run typecheck --workspace apps/worker` — PASS.
- `npm run lint --workspace apps/worker` — PASS.
- `npm run build --workspace apps/worker` — PASS.
- `npm run typecheck` — PASS.
- `npm run lint` — PASS.
- `DATABASE_URL=postgresql://thesiflow:12345678@localhost:5433/thesiflow?schema=public npm test` — PASS, 19 files / 57 tests.
- `npm run build` — PASS after sandbox Turbopack bind retry outside sandbox.
- `docker compose config` with non-secret sample env — PASS; API and worker show SMTP/outbox env.

## API contract decision

Canonical Phase 3+ routing follows `docs/BaoCaoKhoaLuan.docx` and uses `/api/v1/...`:

- `POST /api/v1/organizations`
- `PATCH /api/v1/organizations/:id/status`
- `POST /api/v1/organizations/:id/invitations`
- `POST /api/v1/invitations/:token/accept`
- `POST /api/v1/tenant-context/switch`

Current runtime has legacy unversioned P3-002/P3-003 routes. This task does not redesign those routes. P3-004 must use canonical `/api/v1/tenant-context/switch` and avoid adding any third naming convention.

## Remaining issues

- P3-002/P3-003 route drift remains as documented technical debt.
- Invitation acceptance atomic `status = pending` guard remains deferred.
- Duplicate organization name error mapping remains deferred.
- Organization activation authorization/error leak remains deferred.

## Recommended next task

P3-004 — Tenant context switch APIs/tests.
