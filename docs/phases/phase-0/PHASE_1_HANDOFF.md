# APLP Phase 1 Handoff

## Purpose

Chuẩn bị handoff từ Phase 0 sang Phase 1 Foundation sau khi Phase 0 được sign-off.

## Status

DONE for P0-016 — Phase 1 Handoff.

- Phase 1 chưa IN_PROGRESS trong Phase 0.
- Không tạo runtime artifact trong tài liệu này.
- Handoff chỉ có hiệu lực sau P0-017 pass và P0-018 approval.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Entry Conditions for Phase 1

| Condition | Required State | Current Phase 0 Result |
|---|---|---|
| Scope locked | Product/Core/Demo/Deferred frozen | PASS |
| Stack locked | Express, Next, PostgreSQL, Prisma, Zod, MinIO/S3, worker | PASS |
| Module/data ownership | M01–M18 and DB manifest ownership audited | PASS |
| Invariants | 57 baseline invariants registered | PASS |
| Traceability | FR/API/UI/DB/invariant mapped | PASS |
| ADR | 12 ADR created | PASS |
| Error/evidence/risk/open docs | Baselines created | PASS |
| Sign-off | Human approval required | NEEDS_APPROVAL |

## Phase 1 Objective

Implement Foundation primitives only: platform health/config, PostgreSQL baseline, transactional outbox, idempotency records, redaction/logging direction, worker outbox loop baseline and evidence harness.

## Phase 1 In Scope

| Capability | Module | Tables/Artifacts | Notes |
|---|---|---|---|
| Health/readiness | M01 | health routes | No domain CRUD. |
| System configuration | M01 | `system_configurations` | Minimal safe config only. |
| Idempotency | M01 | `idempotency_records` | Scoped key, payload conflict. |
| Outbox | M01 | `outbox_events` | Dispatch after commit. |
| Audit primitive direction | M16 support | `audit_logs` may be foundation-ready | Critical audit pattern, not full domain audit UI. |
| Worker process | M01/M15 support | outbox worker | Worker not microservice. |
| Evidence harness | M01/QA | test setup | Real PostgreSQL integration direction. |

## Phase 1 Explicitly Out of Scope

- Account registration/login beyond minimum stub needed for health/evidence.
- Tenant onboarding, RBAC UI, academic/project/document/review/evaluation workflows.
- Search/AI.
- Runtime correction of all later-phase tables unless needed to align foundation migration plan.

## Must Preserve from Phase 0

| Area | Rule |
|---|---|
| Architecture | Modular monolith first. |
| Identity | Account global, no tenantId. |
| Authorization | Deny-by-default; no frontend-only auth. |
| DB | PostgreSQL + Prisma; no silent manifest changes. |
| Worker | Shared modules; no business aggregate ownership. |
| Evidence | No DONE without executed evidence. |

## Runtime Mismatch Handoff

| Finding | Required Phase 1 Direction |
|---|---|
| `users.tenant_id` mismatch | Do not extend; plan correction toward `accounts` + `tenant_memberships`. |
| Runtime-only `users`, `tenants`, `user_roles`, `refresh_tokens`, `system_info` | Map/correct via approved implementation plan; do not adopt into manifest silently. |
| Auth/tenant/role coupling | Split by M02/M03/M04 ownership during implementation. |
| Worker SQL | Keep within outbox ownership. |
| Migration not verified applied | Produce real PostgreSQL migration report. |

## Phase 1 Required Evidence

| Evidence | Minimum Passing Proof |
|---|---|
| Migration | Fresh PostgreSQL migration apply log and schema check. |
| Outbox | Mutation + outbox same transaction rollback/commit test. |
| Idempotency | Replay same key/payload, conflict same key/different payload. |
| Redaction | Logs exclude password/hash/token/presigned URL. |
| Worker | Claim/retry/duplicate delivery behavior evidence. |
| Health | Supertest/readiness result. |

## Phase 1 Suggested Sequence

1. Reconcile runtime schema with ADR/P0-008 before adding new features.
2. Implement M01 foundation tables and migration only.
3. Add narrow integration tests against real PostgreSQL.
4. Add worker outbox loop with bounded SQL ownership.
5. Produce evidence report before marking Phase 1 DONE.

## Handoff Checklist

| Check | Result |
|---|---|
| Phase 1 scope excludes account/tenant/domain CRUD | PASS |
| Required evidence listed | PASS |
| Runtime mismatches handed off | PASS |
| Search/AI remains gated | PASS |
| No runtime code changed | PASS |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — roadmap Phase 1, evidence strategy.
- `docs/phase-0/STACK_LOCK.md`
- `docs/phase-0/DATABASE_MANIFEST_AUDIT.md`
- `docs/phase-0/BUSINESS_INVARIANTS.md`
- `docs/phase-0/TRACEABILITY_AUDIT.md`
- `docs/phase-0/EVIDENCE_PLAN.md`
- `docs/phase-0/adr/ADR-001-modular-monolith-first.md`

