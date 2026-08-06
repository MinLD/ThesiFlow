# Phase 3 Plan — Organization/Tenant Onboarding

## Session Rule

Đọc theo thứ tự: `docs/BaoCaoKhoaLuan.docx`, `docs/ROADMAP.md`, file PLAN current phase, file CODE current phase, repository hiện tại. Không chỉ tin Markdown.

## Current Progress

- Current Phase: Phase 3 — Organization/Tenant onboarding
- Phase Status: IN_PROGRESS
- Current Task: P3-001-B — Runtime/domain reconciliation if required after DB pass
- Last Completed Task: P3-001-A — Organization/membership database reconciliation
- Runtime Applied: YES for P3-001-A
- Test Executed: YES — P3-001-A target test PASS; full API test PASS; root lint/typecheck/build PASS
- Next Exact Action: Review P3-001-B runtime/domain reconciliation needs; do not start P3-002.
- Latest Pre-Phase-3 Cleanup: legacy `User`/`UserRole`/`RefreshToken` scaffold removed from Prisma runtime; `USER_CREATED` audit action renamed; Phase 3 now starts from `Account` + remaining `Tenant`/`Role` scaffold.
- Latest Phase 2 Closure: hybrid auth is hardened; auth mail is async through outbox worker; auth/outbox target tests passed 4 files / 13 tests.

## Source Basis

`docs/BaoCaoKhoaLuan.docx`: Phase 3 mục tiêu là tạo biên tổ chức và membership rõ nguồn; một account nhiều tenant; membership inactive không tạo tenant context.

## Task Summary

| Task | Nội dung | Code Draft | Runtime | Test | Trạng thái |
|---|---|---|---|---|---|
| P3-001-A | Database reconciliation cho Organization/Membership/Invitation | APPLIED | YES | YES — PASS | DONE |
| P3-001-B | Runtime/domain reconciliation nếu cần sau DB pass | NOT_STARTED | NO | NO | IN_PROGRESS |
| P3-002 | Organization create/activate APIs | NOT_STARTED | NO | NO | NOT_STARTED |
| P3-003 | Membership invitation/accept lifecycle | NOT_STARTED | NO | NO | NOT_STARTED |
| P3-004 | Tenant context switch APIs/tests | NOT_STARTED | NO | NO | NOT_STARTED |
| P3-005 | Minimal organization UI | NOT_STARTED | NO | NO | NOT_STARTED |

## Latest Session Log

- Time: 2026-08-03 Asia/Ho_Chi_Minh
- Runtime Code Changed: YES — Phase 2 hybrid auth security refactor completed.
- Test Executed: YES — `db:validate`, API/web typecheck, API/web lint, API/web build, full API test pass.
- Task Completed: P2-HOTFIX — Hybrid auth security refactor.
- Current Task: P3-001 — Organization/membership model reconciliation.
- Next Exact Action: Implement P3-001 organization/membership model reconciliation based on Phase 2 account identity; do not start P3-002.

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
- Next Exact Action: Review P3-001-B runtime/domain reconciliation needs; do not start P3-002.
