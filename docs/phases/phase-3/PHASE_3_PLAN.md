# Phase 3 Plan — Organization/Tenant Onboarding

## Session Rule

Đọc theo thứ tự: `docs/BaoCaoKhoaLuan.docx`, `docs/ROADMAP.md`, file PLAN current phase, file CODE current phase, repository hiện tại. Không chỉ tin Markdown.

## Current Progress

- Current Phase: Phase 3 — Organization/Tenant onboarding
- Phase Status: IN_PROGRESS
- Current Task: P3-005 — Minimal organization UI manual browser verification
- Last Completed Task: P3-004 — Tenant context switch APIs/tests
- Runtime Applied: YES for P3-005 implementation
- Test Executed: YES — `npm install` PASS; root typecheck/lint PASS; API tests PASS 20 files / 67 tests; web tests PASS 2 files / 13 tests; worker tests PASS 1 file / 7 tests; Prisma validate/generate PASS; root build PASS; manual browser verification NOT RUN
- Latest Report: `docs/training/reports/2026-08-08_P3-005_REPORT.md`
- Next Exact Action: Run manual browser flows A-G for P3-005; if PASS, mark Phase 3 DONE and open Phase 4 tracking. Do not implement Phase 4 yet.
- Latest Pre-Phase-3 Cleanup: legacy `User`/`UserRole`/`RefreshToken` scaffold removed from Prisma runtime; `USER_CREATED` audit action renamed; Phase 3 now starts from `Account` + remaining `Tenant`/`Role` scaffold.
- Latest Phase 2 Closure: hybrid auth is hardened; auth mail is async through outbox worker; auth/outbox target tests passed 4 files / 13 tests.

## Source Basis

`docs/BaoCaoKhoaLuan.docx`: Phase 3 mục tiêu là tạo biên tổ chức và membership rõ nguồn; một account nhiều tenant; membership inactive không tạo tenant context.

## API Contract Decision Before P3-004

- Canonical source-of-truth routes use `/api/v1/...`: `POST /api/v1/organizations`, `PATCH /api/v1/organizations/:id/status`, `POST /api/v1/organizations/:id/invitations`, `POST /api/v1/invitations/:token/accept`, `POST /api/v1/tenant-context/switch`.
- Runtime Phase 3 routes currently include unversioned legacy endpoints: `POST /organizations`, `POST /organizations/:organizationId/activate`, `POST /organizations/:organizationId/invitations`, `POST /membership-invitations/accept`.
- Decision: do not redesign completed P3-002/P3-003 routes in this hardening task; P3-004 must use canonical `/api/v1/tenant-context/switch` and avoid introducing a third naming convention.

## Foundation Hardening Before P3-004

- Status: DONE
- Runtime Applied: YES
- Test status: PASS — worker outbox integration tests 1 file / 7 tests; full API tests 19 files / 57 tests; root typecheck/lint/build PASS.
- Scope: Docker worker SMTP env, outbox stale lock reclaim via `OUTBOX_LOCK_TIMEOUT_MS`, Prisma package alignment, boolean env parsing, README/`.env.example` cleanup.
- Report: `docs/training/reports/2026-08-08_PHASE_3_FOUNDATION_HARDENING_REPORT.md`.

## Task Summary

| Task | Nội dung | Code Draft | Runtime | Test | Trạng thái |
|---|---|---|---|---|---|
| P3-001-A | Database reconciliation cho Organization/Membership/Invitation | APPLIED | YES | YES — PASS | DONE |
| P3-001-B | Runtime/domain boundary assessment sau DB pass | REVIEWED | NO | YES — PASS | DONE |
| P3-002 | Organization create/activate APIs | APPLIED | YES | YES — PASS | DONE |
| P3-003 | Membership invitation/accept lifecycle | APPLIED | YES | YES — PASS | DONE |
| P3-004 | Tenant context switch APIs/tests | APPLIED | YES | YES — PASS | DONE |
| P3-005 | Minimal organization UI | APPLIED | YES | YES — automated PASS; manual browser pending | IN_REVIEW |

## Latest Session Log

- Time: 2026-08-08 Asia/Ho_Chi_Minh
- Runtime Code Changed: YES — P3-005 minimal organization UI and `GET /api/v1/me/memberships` supporting API implemented.
- Test Executed: YES — `npm install` PASS; root typecheck/lint PASS; API tests PASS 20 files / 67 tests; web tests PASS 2 files / 13 tests; worker tests PASS 1 file / 7 tests; Prisma validate/generate PASS; root build PASS; manual browser verification NOT RUN.
- Task Completed: NOT YET — browser manual verification remains pending.
- Current Task: P3-005 — Minimal organization UI manual browser verification.
- Next Exact Action: Run manual browser flows A-G; if PASS, mark Phase 3 DONE and create/open Phase 4 tracking. Do not implement Phase 4.

- Time: 2026-08-08 Asia/Ho_Chi_Minh
- Runtime Code Changed: YES — P3-004 canonical tenant context switch API implemented at `POST /api/v1/tenant-context/switch`.
- Test Executed: YES — target P3-004 tests PASS 2 files / 11 tests; full API tests PASS 20 files / 66 tests; worker tests PASS 1 file / 7 tests; root db validate/generate/typecheck/lint/build PASS.
- Task Completed: P3-004 — Tenant context switch APIs/tests.
- Current Task: P3-005 — Minimal organization UI.
- Next Exact Action: Create/read P3-005 task and implement minimal organization UI; do not start Phase 4.

- Time: 2026-08-08 Asia/Ho_Chi_Minh
- Runtime Code Changed: YES — Phase 3 foundation hardening applied before P3-004.
- Test Executed: YES — Prisma validate/generate PASS; worker outbox tests PASS 1 file / 7 tests; full API tests PASS 19 files / 57 tests; root typecheck/lint/build PASS; docker compose config PASS.
- Task Completed: Phase 3 Foundation Hardening.
- Current Task: P3-004 — Tenant context switch APIs/tests.
- Next Exact Action: Implement P3-004 tenant context switch APIs/tests using canonical `/api/v1/tenant-context/switch`; do not start P3-005.

- Time: 2026-08-06 Asia/Ho_Chi_Minh
- Runtime Code Changed: YES — P3-003 membership invitation lifecycle implemented.
- Test Executed: YES — P3 tenancy tests PASS 4 files / 14 tests; full API test PASS 19 files / 56 tests; root lint/typecheck/build PASS.
- Task Completed: P3-003 — Membership invitation/accept lifecycle.
- Current Task: P3-004 — Tenant context switch APIs/tests.
- Next Exact Action: Create/read P3-004 task and implement tenant context switch APIs/tests; do not start P3-005.

## P3-001 — Organization/membership model reconciliation

- Status: IN_PROGRESS
- Mục tiêu: chuyển scaffold `Tenant`/`UserRole` cũ sang model Phase 3 `Organization`, `TenantMembership`, `MembershipInvitation` dựa trên `Account` Phase 2.
- Tại sao cần làm: Phase 2 đã tạo global account; Phase 3 cần tenant boundary không gắn cứng account vào tenant.
- Phụ thuộc task nào: Phase 2.
- Những file dự kiến tạo: migration Phase 3, organization repository/service/routes theo nhu cầu.
- Những file dự kiến sửa: `apps/api/prisma/schema.prisma`, seed, auth/session context nếu cần.
- Database/migration liên quan: `organizations`, `tenant_memberships`, `membership_invitations`.
- Backend liên quan: organization console API, invitation accept, membership status.
- Frontend liên quan: chưa ở P3-001.
- Worker liên quan: chưa có.
- Test cần viết: account nhiều organization, inactive membership không tạo tenant context.
- Điều kiện hoàn thành: schema/model reconciliation pass; no Phase 4 RBAC implementation.
- Code nằm ở phần nào trong PHASE_3_CODE.md: sẽ nằm trong `docs/phases/phase-3/PHASE_3_CODE.md` mục P3-001.
- Next Task: P3-002.

## P3-001-A — Organization/membership database reconciliation

- Status: DONE
- Daily task: `docs/training/tasks/2026-08-06_P3-001-A.md`
- Database spec: `docs/training/database-specs/2026-08-06_P3-001-A_DATABASE.md`
- Test file: `apps/api/tests/tenancy/organization-membership-reconciliation.test.ts`
- Runtime Applied: YES — `schema.prisma`, migration, seed and generated Prisma client reconciled.
- Database mode: DATABASE_APPLIED.
- Test status: PASS — target tenancy test 1 file / 4 tests.
- Typecheck status: PASS.
- Report: `docs/training/reports/2026-08-06_P3-001-A_REPORT.md`.
- Next Exact Action: Move to P3-002 organization create/activate API.

## P3-001-B — Runtime/domain reconciliation assessment

- Status: DONE
- Daily task: `docs/training/tasks/2026-08-06_P3-001-B.md`
- Test file: `apps/api/tests/tenancy/runtime-reconciliation-boundary.test.ts`
- Runtime Applied: NO — assessment/boundary test only.
- Database mode: DATABASE_SPEC_ONLY — no new DB change.
- Test status: PASS — target boundary test 1 file / 2 tests.
- Next Exact Action: Move to P3-002 organization create/activate API.

## P3-002 — Organization create/activate APIs

- Status: DONE
- Daily task: `docs/training/tasks/2026-08-06_P3-002.md`
- Test file: `apps/api/tests/tenancy/organization-create-activate.test.ts`
- Runtime Applied: YES — organization module implemented and mounted.
- Database mode: DATABASE_SPEC_ONLY — no new schema or migration expected.
- Test status: PASS — target tenancy test 1 file / 4 tests.
- Report: `docs/training/reports/2026-08-06_P3-002_REPORT.md`.
- Next Exact Action: Create/read P3-003 task and implement membership invitation/accept lifecycle; do not start P3-004.

## P3-003 — Membership invitation/accept lifecycle

- Status: DONE
- Daily task: `docs/training/tasks/2026-08-06_P3-003.md`
- Database spec: `docs/training/database-specs/2026-08-06_P3-003_DATABASE.md`
- Test file: `apps/api/tests/tenancy/membership-invitation-lifecycle.test.ts`
- Runtime Applied: YES — invitation create/accept routes implemented.
- Database mode: DATABASE_SPEC_ONLY — no migration expected.
- Test status: PASS — target invitation lifecycle test 1 file / 4 tests.
- Report: `docs/training/reports/2026-08-06_P3-003_REPORT.md`.
- Review: `docs/training/reviews/2026-08-08_P3-003_REVIEW.md` — PASS_WITH_MINOR_NOTES.
- Next Exact Action: Create/read P3-004 task and implement tenant context switch APIs/tests; do not start P3-005.

## P3-004 — Tenant context switch APIs/tests

- Status: DONE
- Daily task: user prompt 2026-08-08.
- Test file: `apps/api/tests/tenancy/tenant-context-switch.test.ts`.
- Runtime Applied: YES — canonical `POST /api/v1/tenant-context/switch` route only.
- Database mode: DATABASE_UNCHANGED — read-only lookup from `tenant_memberships` + `organizations`.
- Test status: PASS — target P3-004 tests 2 files / 11 tests; full API 20 files / 66 tests.
- Typecheck/lint/build status: PASS.
- Report: `docs/training/reports/2026-08-08_P3-004_REPORT.md`.
- Next Exact Action: Move to P3-005 minimal organization UI; do not start Phase 4.
