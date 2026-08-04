# Phase 2 Plan — Global Account Authentication

## Session Rule

Đọc theo thứ tự: `docs/BaoCaoKhoaLuan.docx`, `docs/ROADMAP.md`, file PLAN current phase, file CODE current phase, repository hiện tại. Không chỉ tin Markdown.

## Current Progress

- Current Phase: Phase 2 — Global account authentication
- Phase Status: DONE
- Current Task: NONE — Phase 2 complete
- Last Completed Task: P2-HOTFIX — Auth DTO/mapper layering cleanup
- Runtime Applied: YES for P2-001/P2-006
- Test Executed: YES for Phase 2
- Next Exact Action: Continue Phase 3 P3-001 in `docs/phases/phase-3/PHASE_3_PLAN.md`.
- Latest Cleanup: legacy `User`/`UserRole`/`RefreshToken` Prisma scaffold removed; `USER_CREATED` audit action renamed; seed now creates global `Account`.
- Latest Security Hardening: memory-only JWT access token, rotating opaque refresh cookie, atomic session consume, session family reuse revocation, origin/CORS guard, session management endpoints, auth audit actions.
- Latest Layering Cleanup: auth DTO and mapper extracted from service/controller; behavior unchanged.

## Source Basis

`docs/BaoCaoKhoaLuan.docx`: Phase 2 mục tiêu là account toàn cục và session an toàn, chưa gắn cứng tenant.

## Task Summary

| Task | Nội dung | Code Draft | Runtime | Test | Trạng thái |
|---|---|---|---|---|---|
| P2-001 | Reconcile global account model với scaffold auth/tenant hiện có | DONE | YES | PASS | VERIFIED |
| P2-002 | Account credentials/password/token primitives | DONE | YES | PASS | VERIFIED |
| P2-003 | Register/login/logout/refresh APIs | DONE | YES | PASS | VERIFIED |
| P2-004 | Session cookie/security tests | DONE | YES | PASS | VERIFIED |
| P2-005 | Minimal auth UI draft | DONE | YES | PASS | VERIFIED |
| P2-006 | Email verification, password reset, `/auth/me` closure | DONE | YES | PASS | VERIFIED |
| P2-HOTFIX | Hybrid auth security hardening | DONE | YES | PASS | VERIFIED |

## Latest Session Log

- Time: 2026-08-04 Asia/Ho_Chi_Minh
- Runtime Code Changed: YES — split Phase 2 auth DTO/mapper from service/controller.
- Test Executed: YES — API typecheck/lint/build PASS; auth target tests PASS 3 files / 12 tests.
- Task Completed: P2-HOTFIX — Auth DTO/mapper layering cleanup.
- Current Task: Phase 3 P3-001 — Organization/membership model reconciliation.
- Next Exact Action: Continue Phase 3 P3-001 in `docs/phases/phase-3/PHASE_3_PLAN.md`.

## P2-001 — Reconcile global account model với scaffold auth/tenant hiện có

- Status: VERIFIED
- Mục tiêu: tạo account toàn cục không có `tenantId`, chuẩn bị credential/token/session chuẩn Phase 2.
- Tại sao cần làm: scaffold cũ `User`/`RefreshToken` đang gắn `Tenant`, trái invariant `Account không có tenantId`.
- Phụ thuộc task nào: Phase 1 Foundation.
- Những file dự kiến tạo: `apps/api/prisma/migrations/20260731090000_phase_02_global_identity/migration.sql`, `apps/api/tests/auth/account-model.contract.test.ts`.
- Những file dự kiến sửa: `apps/api/prisma/schema.prisma`, `apps/api/src/modules/auth/auth.repository.ts`, `apps/api/src/common/auth/token.ts`.
- Database/migration liên quan: thêm `accounts`, `account_credentials`, `account_tokens`, `sessions`; cleanup credential type discriminator; password-only credential table.
- Backend liên quan: auth repository chuyển sang `Account`; access token payload bỏ `tenantId`.
- Frontend liên quan: chưa có.
- Worker liên quan: chưa có.
- Test cần viết: account global tenant-free; token/session chỉ lưu hash.
- Điều kiện hoàn thành: runtime schema/repository/token payload applied; Prisma validate/typecheck pass.
- Code nằm ở phần nào trong PHASE_2_CODE.md: xem `docs/phases/phase-2/PHASE_2_CODE.md` mục P2-001.
- Next Task: P2-002.

## P2-002 — Account credentials/password/token primitives

- Status: VERIFIED
- Mục tiêu: draft primitive hash password, verify password, opaque token hash, email verification/reset token lifecycle.
- Tại sao cần làm: Phase 2 cần token hash một lần, expiry/consume an toàn trước khi mở API auth.
- Phụ thuộc task nào: P2-001.
- Những file dự kiến tạo: `apps/api/src/modules/auth/credential.service.ts`, `apps/api/src/modules/auth/account-token.service.ts`, `apps/api/tests/auth/credential-token.service.test.ts`.
- Những file dự kiến sửa: `apps/api/src/common/auth/password.ts`, `apps/api/src/common/auth/token.ts` nếu cần gom helper hash/TTL.
- Database/migration liên quan: dùng `account_credentials`, `account_tokens`.
- Backend liên quan: credential/token service; Prisma access nằm trong `auth.repository.ts`; `eslint.config.mjs` chặn auth service import DB trực tiếp.
- Frontend liên quan: chưa có.
- Worker liên quan: chưa có.
- Test cần viết: password verify, token hash one-way, expiry; consume/revoke DB lifecycle qua repository boundary.
- Điều kiện hoàn thành: credential/token primitive runtime applied; service/repository boundary guarded; targeted test/typecheck/lint/db validate pass.
- Code nằm ở phần nào trong PHASE_2_CODE.md: sẽ nằm trong `docs/phases/phase-2/PHASE_2_CODE.md` mục P2-002.
- Next Task: P2-003.

## P2-003 — Register/login/logout/refresh APIs

- Status: VERIFIED
- Mục tiêu: mở API đăng ký, đăng nhập, refresh rotation, logout dựa trên account/session toàn cục.
- Tại sao cần làm: Phase 2 cần auth E2E trước UI và security test.
- Phụ thuộc task nào: P2-001, P2-002.
- Những file dự kiến tạo: `apps/api/src/modules/auth/auth.schemas.ts`, `apps/api/src/modules/auth/auth.service.ts`, `apps/api/src/modules/auth/auth.controller.ts`, `apps/api/src/modules/auth/auth.routes.ts`, `apps/api/tests/auth/auth.routes.test.ts`.
- Những file dự kiến sửa: `apps/api/src/app.ts`, `apps/api/src/modules/auth/auth.repository.ts`, `apps/api/src/common/auth/cookie.ts` nếu cần path chuẩn.
- Database/migration liên quan: dùng `accounts`, `account_credentials`, `account_tokens`, `sessions`; không thêm migration nếu đủ.
- Backend liên quan: public auth endpoints; refresh cookie; safe auth errors.
- Frontend liên quan: chưa có.
- Worker liên quan: chưa có.
- Test cần viết: register duplicate-safe, login safe error, refresh rotation, logout revoke.
- Điều kiện hoàn thành: register/login/refresh/logout runtime smoke pass; typecheck/lint/db validate pass; account không có tenant coupling.
- Code nằm ở phần nào trong PHASE_2_CODE.md: sẽ nằm trong `docs/phases/phase-2/PHASE_2_CODE.md` mục P2-003.
- Next Task: P2-004.

## P2-004 — Session cookie/security tests

- Status: VERIFIED
- Mục tiêu: bổ sung test cho cookie httpOnly/path, safe auth errors, refresh reuse, logout revoke.
- Tại sao cần làm: P2-003 đã có API chạy được; P2-004 khóa hành vi bảo mật trước UI.
- Phụ thuộc task nào: P2-003.
- Những file dự kiến tạo: `apps/api/tests/auth/session-security.test.ts` hoặc vị trí test được track nếu bỏ ignore.
- Những file dự kiến sửa: có thể sửa `apps/api/src/modules/auth/auth.service.ts`, `apps/api/src/common/auth/cookie.ts` nếu test phát hiện lỗi.
- Database/migration liên quan: không dự kiến.
- Backend liên quan: auth session/cookie behavior.
- Frontend liên quan: chưa có.
- Worker liên quan: chưa có.
- Test cần viết: cookie flags, invalid credential safe error, refresh rotation reuse revokes active sessions, logout clears cookie.
- Điều kiện hoàn thành: security tests pass; no tenant coupling.
- Code nằm ở phần nào trong PHASE_2_CODE.md: sẽ nằm trong `docs/phases/phase-2/PHASE_2_CODE.md` mục P2-004.
- Next Task: P2-005.

## P2-005 — Minimal auth UI draft

- Status: VERIFIED
- Mục tiêu: thêm UI tối thiểu cho register/login/logout trên homepage.
- Tại sao cần làm: Phase 2 cần xác minh API/UI auth vertical slice trước Phase 3 tenant context.
- Phụ thuộc task nào: P2-004.
- Những file dự kiến tạo: `apps/web/src/features/auth/auth.api.ts`, `apps/web/src/features/auth/AuthPanel.tsx`.
- Những file dự kiến sửa: `apps/web/src/lib/apiClient.ts`, `apps/web/src/app/page.tsx`.
- Database/migration liên quan: không có.
- Backend liên quan: dùng P2-003 `/auth/register`, `/auth/login`, `/auth/logout`.
- Frontend liên quan: auth form, status panel, logout action.
- Worker liên quan: chưa có.
- Test cần viết: web typecheck/lint/build.
- Điều kiện hoàn thành: web typecheck/lint/build pass.
- Code nằm ở phần nào trong PHASE_2_CODE.md: xem `docs/phases/phase-2/PHASE_2_CODE.md` mục P2-005.
- Next Task: Phase 3 P3-001.

## P2-006 — Email verification, password reset, and current account APIs

- Status: VERIFIED
- Mục tiêu: hoàn tất vòng đời account Phase 2 thay vì chỉ có register/login/refresh/logout.
- Tại sao cần làm: register auto-active là chưa đủ nghiêm túc; Phase 2 cần account pending, verify email, reset password, `/auth/me`.
- Phụ thuộc task nào: P2-001, P2-002, P2-003, P2-004, P2-005.
- Những file dự kiến tạo: `apps/api/tests/auth/account-lifecycle.test.ts`.
- Những file dự kiến sửa: `apps/api/src/modules/auth/auth.repository.ts`, `apps/api/src/modules/auth/auth.service.ts`, `apps/api/src/modules/auth/auth.controller.ts`, `apps/api/src/modules/auth/auth.routes.ts`, `apps/api/src/modules/auth/auth.schemas.ts`, `apps/web/src/features/auth/auth.api.ts`, `apps/web/src/features/auth/AuthPanel.tsx`, `apps/api/tests/auth/session-security.test.ts`.
- Database/migration liên quan: không thêm migration; dùng sẵn `accounts`, `account_credentials`, `account_tokens`, `sessions`.
- Backend liên quan: `POST /auth/verify-email`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `GET /auth/me`.
- Frontend liên quan: minimal panel hỗ trợ token verify/reset trong môi trường dev/test; pages `/verify-email` và `/reset-password` xử lý link email.
- Worker liên quan: chưa có; email provider thật chưa thuộc runtime hiện tại.
- Test cần viết: register pending, verify email one-time token, blocked login before verify, `/auth/me`, forgot safe response, reset password revokes sessions/reuses blocked.
- Điều kiện hoàn thành: API/web typecheck/lint/build pass; lifecycle và session tests pass; SMTP verify/send pass; không vi phạm service/repository boundary.
- Code nằm ở phần nào trong PHASE_2_CODE.md: xem mục `P2-006 Runtime Implementation`.
- Next Task: Phase 3 P3-001.
