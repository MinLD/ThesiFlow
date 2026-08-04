# Phase 3 Plan — Organization/Tenant Onboarding

## Session Rule

Đọc theo thứ tự: `docs/BaoCaoKhoaLuan.docx`, `docs/ROADMAP.md`, file PLAN current phase, file CODE current phase, repository hiện tại. Không chỉ tin Markdown.

## Current Progress

- Current Phase: Phase 3 — Organization/Tenant onboarding
- Phase Status: IN_PROGRESS
- Current Task: P3-001 — Organization/membership model reconciliation
- Last Completed Task: Phase 2 — Global account authentication
- Runtime Applied: NO for Phase 3
- Test Executed: NO for Phase 3
- Next Exact Action: Implement P3-001 organization/membership model reconciliation based on Phase 2 account identity; do not start P3-002.
- Latest Pre-Phase-3 Cleanup: legacy `User`/`UserRole`/`RefreshToken` scaffold removed from Prisma runtime; `USER_CREATED` audit action renamed; Phase 3 now starts from `Account` + remaining `Tenant`/`Role` scaffold.
- Latest Phase 2 Closure: hybrid auth is hardened with memory-only access token, HttpOnly rotating refresh cookie, session family reuse revocation, session management, origin/CORS guard, and audit actions; full API test passed 15 files / 42 tests.

## Source Basis

`docs/BaoCaoKhoaLuan.docx`: Phase 3 mục tiêu là tạo biên tổ chức và membership rõ nguồn; một account nhiều tenant; membership inactive không tạo tenant context.

## Task Summary

| Task | Nội dung | Code Draft | Runtime | Test | Trạng thái |
|---|---|---|---|---|---|
| P3-001 | Reconcile organization/membership model với scaffold tenant cũ | NOT_STARTED | NO | NO | IN_PROGRESS |
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
