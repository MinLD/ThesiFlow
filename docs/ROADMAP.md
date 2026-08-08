# APLP Roadmap

## Session Rule

Khi bắt đầu session mới, AI phải đọc theo thứ tự:

1. `docs/BaoCaoKhoaLuan.docx`
2. `docs/ROADMAP.md`
3. File PLAN của Current Phase
4. File CODE của Current Phase
5. Repository hiện tại

Sau khi đọc: xác định Current Phase, Current Task, task cuối cùng đã hoàn thành, code cuối cùng đã viết, code đã áp dụng runtime hay chưa; không làm lại task đã hoàn thành; tiếp tục đúng Next Exact Action; cuối session cập nhật lại `docs/ROADMAP.md`, PLAN và CODE. Không chỉ tin Markdown; phải kiểm tra repository trước khi viết tiếp.

## Current Snapshot

- Current Phase: Phase 3 — Organization/Tenant onboarding
- Current Phase Status: IN_PROGRESS
- Current Task: P3-005 — Minimal organization UI manual browser verification
- Last Completed Task: P3-004 — Tenant context switch APIs/tests
- Next Exact Action: Run manual browser verification for P3-005; if PASS, mark Phase 3 DONE and open Phase 4 tracking. Do not implement Phase 4 yet.
- Official Daily Status Source: `docs/ROADMAP.md`
- Current Phase Plan: `docs/phases/phase-3/PHASE_3_PLAN.md`
- Current Phase Code Drafts: `docs/phases/phase-3/PHASE_3_CODE.md`
- Runtime Code Changed In Latest Session: YES — P3-005 minimal organization UI plus supporting `GET /api/v1/me/memberships` API implemented
- Test Executed In Latest Session: YES — `npm install` PASS; root typecheck/lint PASS; API tests PASS 20 files / 67 tests; web tests PASS 2 files / 13 tests; worker tests PASS 1 file / 7 tests; Prisma validate/generate PASS; root build PASS; manual browser verification NOT RUN in CLI environment
- Latest Report: `docs/training/reports/2026-08-08_P3-005_REPORT.md`

## Source References

- Source of truth: `docs/BaoCaoKhoaLuan.docx`, Chương 7.1 Roadmap tổng quát, Bảng Roadmap Phase 0-13.
- Phase 0 approved references retained: `docs/phases/phase-0/PHASE_0_SIGN_OFF.md`, `docs/phases/phase-0/adr/`, `docs/phases/phase-0/OPEN_DECISIONS.md`.
- Phase 1 notes are tracked in `docs/phases/phase-1/PHASE_1_PLAN.md` and `docs/phases/phase-1/PHASE_1_CODE.md`; no separate Phase 1 evidence folder is used.

## Phase Roadmap

| Phase | Tên | Mục tiêu chính | Nhóm chức năng chính | Điều kiện hoàn thành | Trạng thái |
|---|---|---|---|---|---|
| Phase 0 | Architecture reconciliation và scope freeze | Đóng băng bốn lớp phạm vi, thuật ngữ, invariant, module boundary, Database Capability Manifest và evidence plan | Scope, stack, module boundaries, ADR, risk, evidence, sign-off | Phase 0 sign-off recorded and approved | DONE |
| Phase 1 | Foundation, monorepo, PostgreSQL, worker, outbox và test foundation | Dựng nền tảng chạy được và các primitive độ tin cậy trước domain | Workspace, config, PostgreSQL/Prisma, request ID, error envelope, logging/redaction, idempotency, outbox, worker, system config, health, test foundation | `npm run phase1:check` PASS; `npm run build` PASS | DONE |
| Phase 2 | Global account authentication | Có account toàn cục và session an toàn, chưa gắn cứng tenant | Accounts, credentials, tokens, sessions, auth API/UI | Global auth works; no account tenant coupling; security tests pass | DONE |
| Phase 3 | Organization/Tenant onboarding | Tạo biên tổ chức và membership rõ nguồn | Organizations, tenant memberships, invitations, tenant context switch | Active membership context verified; tenant isolation baseline pass | IN_PROGRESS |
| Phase 4 | RBAC và resource authorization | Thiết lập deny-by-default theo tenant, role, scope, relationship và state | Permission catalog, roles, assignments, resource guards | Cross-tenant, IDOR and privilege escalation tests pass | NOT_STARTED |
| Phase 5 | Academic organization và profile | Mô hình hóa cấu trúc trường/trung tâm và placement lịch sử | Academic units, student/lecturer profiles, placement history | Academic hierarchy/profile lifecycle verified | NOT_STARTED |
| Phase 6 | Campaign framework và campaign types | Cho phép cấu hình campaign/template thay vì workflow hard-code | Campaign templates, versions, campaigns, participants, policy snapshots | Campaign lifecycle and template versioning verified | NOT_STARTED |
| Phase 7 | Topic proposal/catalog và approval | Quản lý proposal thành topic chính thức có evidence | Topic proposals, decisions, campaign topic catalog | Approval is idempotent; official topic evidence exists | NOT_STARTED |
| Phase 8 | Registration và Project creation | Từ đăng ký hợp lệ tạo đúng một Project | Registrations, approval, project materialization | One approved registration creates one project; concurrency tests pass | NOT_STARTED |
| Phase 9 | Project membership, supervision và progress | Thiết lập nhóm chính thức, hướng dẫn và tiến độ tối thiểu | Project members, supervision, milestones/progress | Relationship authorization and progress evidence pass | NOT_STARTED |
| Phase 10 | Document direct upload và versioning | Tải tệp không proxy qua API và tạo version bất biến | Upload sessions, S3/MinIO, document versions, controlled download | Immutable versions and storage security evidence pass | NOT_STARTED |
| Phase 11 | Submission và feedback | Ghim bản nộp chính thức và phản hồi đúng phiên bản | Submissions, version pinning, feedback | Submission/feedback pinning and visibility tests pass | NOT_STARTED |
| Phase 12 | Review và evaluation | Chấm đúng target/rubric và khóa kết quả có bằng chứng | Rubrics, reviews, evaluations, finalization, appeal baseline | Review/evaluation/finalization evidence pass | NOT_STARTED |
| Phase 13 | Notification, audit, hardening và workflow E2E | Khép vertical slice và tạo artifact bảo vệ | Notifications, audit timeline, hardening, full THESIS E2E | Full workflow E2E, security and evidence package pass | NOT_STARTED |

## Transition Rule

Khi Phase 1 hoàn thành: đặt Phase 1 = DONE, Phase 2 = IN_PROGRESS, tạo `docs/phases/phase-2/PHASE_2_PLAN.md` và `docs/phases/phase-2/PHASE_2_CODE.md` dựa trên `docs/BaoCaoKhoaLuan.docx`. Không tạo code chi tiết cho Phase 2 trước khi Phase 2 trở thành Current Phase.

## Retained Reference Docs

| File/Directory | Reason |
|---|---|
| `docs/phases/phase-0/PHASE_0_SIGN_OFF.md` | Approved sign-off; must not be lost. |
| `docs/phases/phase-0/adr/` | Approved architectural decisions. |
| `docs/phases/phase-0/OPEN_DECISIONS.md` | Open decisions not yet transferred into runtime rules. |
| `docs/phases/phase-0/*.md` | Phase 0 reference/audit artifacts; not daily tracking. |
| `docs/PROJECT_STATUS.md` | Reduced pointer to this roadmap for compatibility only; not official status. |

## Latest Session Log

- Time: 2026-08-08 Asia/Ho_Chi_Minh
- Executor: Codex CLI
- Work Performed: Implemented P3-005 minimal organization UI: tenant selector, tenant switch, organization workspace, create/activate form, invitation form, invitation accept page, and supporting membership list API.
- Runtime Code Changed: YES — web tenancy provider/dashboard added; `GET /api/v1/me/memberships` added as read-only supporting API; canonical switch remains `POST /api/v1/tenant-context/switch`.
- Files Deleted: NONE.
- Task Completed: NOT YET — automated verification PASS; manual browser verification still pending in non-browser CLI environment.
- Current Task: P3-005 — Minimal organization UI manual browser verification.
- Runtime Applied: YES for P3-005 implementation.
- Test Executed: YES — `npm install` PASS; `npm run typecheck` PASS; `npm run lint` PASS; `DATABASE_URL=... npm test` PASS 20 files / 67 tests after sandbox retry; `npm test --workspace apps/web` PASS 2 files / 13 tests; `npm test --workspace apps/worker` PASS 1 file / 7 tests; `npm run db:validate` PASS; `npm run prisma:generate --workspace apps/api` PASS; `npm run build` PASS; `git diff --check` PASS.
- Manual Browser Verification: NOT RUN — no browser automation/GUI available in current CLI session.
- Next Exact Action: Run manual browser flows A-G for P3-005; if PASS, mark Phase 3 DONE and create/open Phase 4 tracking. Do not implement Phase 4 yet.

- Time: 2026-08-08 Asia/Ho_Chi_Minh
- Executor: Codex CLI
- Work Performed: Implemented P3-004 canonical tenant context switch API at `POST /api/v1/tenant-context/switch`; added shared bearer account resolver; resolved context from authenticated account + active membership + active organization; added P3-004 integration tests.
- Runtime Code Changed: YES — tenant context module added; `app.ts` mounts only canonical `/api/v1/tenant-context`; organization service now reuses shared active account helper.
- Files Deleted: NONE.
- Task Completed: P3-004 — Tenant context switch APIs/tests.
- Current Task: P3-005 — Minimal organization UI.
- Runtime Applied: YES for P3-004.
- Test Executed: YES — `DATABASE_URL=... npm run test --workspace apps/api -- tenancy/tenant-context-switch.test.ts tenancy/runtime-reconciliation-boundary.test.ts` PASS 2 files / 11 tests; `npm run db:validate` PASS; `npm run prisma:generate --workspace apps/api` PASS; `npm run typecheck` PASS; `npm run lint` PASS; `DATABASE_URL=... npm test` PASS 20 files / 66 tests; `npm run test --workspace apps/worker` PASS 1 file / 7 tests; `DATABASE_URL=... npm test --workspace apps/api` PASS 20 files / 66 tests; `npm run build` PASS.
- API Contract Decision: P3-004 ships only `POST /api/v1/tenant-context/switch`; no new unversioned switch route.
- Next Exact Action: Create/read P3-005 task and implement minimal organization UI; do not start Phase 4.

- Time: 2026-08-04 Asia/Ho_Chi_Minh
- Executor: Codex CLI
- Work Performed: Moved auth email delivery off API request path into outbox worker.
- Runtime Code Changed: YES — API auth service enqueues `mail.send.v1`; worker claims outbox rows and sends SMTP with retry.
- Files Deleted: NONE.
- Task Completed: P2-HOTFIX — Async auth mail via outbox worker.
- Current Task: P3-001 — Organization/membership model reconciliation.
- Runtime Applied: YES for P2-001/P2-006; NO for Phase 3.
- Test Executed: YES — API/worker typecheck; API/worker lint; API/worker build; `DATABASE_URL=... npm run test --workspace apps/api -- auth/account-lifecycle.test.ts auth/session-security.test.ts auth/frontend-auth-boundary.test.ts outboxRepository.test.ts` PASS 4 files / 13 tests.
- Historical Next Action At That Time: Developer applied P3-001-A database contract before moving to P3-001-B.

- Time: 2026-08-06 Asia/Ho_Chi_Minh
- Executor: Codex CLI
- Work Performed: Reviewed P3-002 implementation, deferred non-blocking P2 hardening notes, created P3-003 membership invitation/accept lifecycle test/task/spec.
- Runtime Code Changed: NO — tests/docs only by AI.
- Files Deleted: NONE.
- Task Completed: P3-002 — Organization create/activate APIs.
- Historical Current Task At That Time: P3-003 — Membership invitation/accept lifecycle.
- Runtime Applied: YES for P3-001-A.
- Historical Test Executed: YES — P3-002 full review checks PASS; P3-003 pre-implementation target check failed as expected.
- Historical Next Action At That Time: Developer implements P3-003 membership invitation/accept lifecycle to satisfy `apps/api/tests/tenancy/membership-invitation-lifecycle.test.ts`; do not start P3-004 or Phase 4.

- Time: 2026-08-06 Asia/Ho_Chi_Minh
- Executor: Codex CLI
- Work Performed: Implemented P3-002 minimal organization create/activate backend API.
- Runtime Code Changed: YES — added organization routes/controller/service/repository/schemas/mapper; mounted `/organizations`; updated boundary test for P3-002 route scope; fixed Prisma schema drift by restoring `MembershipInvitation` model and regenerating client.
- Files Deleted: NONE.
- Task Completed: P3-002 — Organization create/activate APIs.
- Historical Current Task At That Time: P3-003 — Membership invitation/accept lifecycle.
- Runtime Applied: YES for P3-002.
- Test Executed: YES — P3 tenancy tests PASS 3 files / 10 tests; `npm run db:validate` PASS; root `npm run lint` PASS; root `npm run typecheck` PASS; full API `npm run test` PASS 18 files / 52 tests; root `npm run build` PASS.
- Historical Next Action At That Time: Create/read P3-003 task and implement membership invitation/accept lifecycle; do not start P3-004 or Phase 4.

- Time: 2026-08-08 Asia/Ho_Chi_Minh
- Executor: Codex CLI
- Work Performed: Implemented P3-003 membership invitation create/accept lifecycle.
- Runtime Code Changed: YES — added `POST /organizations/:organizationId/invitations`, `POST /membership-invitations/accept`, token hashing, recipient matching, accepted invitation transition, active membership creation, safe invitation DTOs and P3-003 boundary test update.
- Files Deleted: NONE.
- Task Completed: P3-003 — Membership invitation/accept lifecycle.
- Current Task: P3-004 — Tenant context switch APIs/tests.
- Runtime Applied: YES for P3-003.
- Test Executed: YES — P3 tenancy tests PASS 4 files / 14 tests; `npm run db:validate` PASS; root `npm run lint` PASS; root `npm run typecheck` PASS; full API `npm run test` PASS 19 files / 56 tests; root `npm run build` PASS.
- Review: `docs/training/reviews/2026-08-08_P3-003_REVIEW.md` — PASS_WITH_MINOR_NOTES; no P0/P1; P2 atomic pending guard deferred.
- Next Exact Action: Create/read P3-004 task and implement tenant context switch APIs/tests; do not start P3-005 or Phase 4.

- Time: 2026-08-08 Asia/Ho_Chi_Minh
- Executor: Codex CLI
- Work Performed: Hardened Phase 3 foundation before P3-004: worker Docker SMTP env, outbox stale processing reclaim, worker outbox integration tests, Prisma package alignment, boolean env parsing, README/env cleanup, API contract drift documented.
- Runtime Code Changed: YES — worker claim query now reclaims stale `processing` rows via `OUTBOX_LOCK_TIMEOUT_MS` while keeping `FOR UPDATE SKIP LOCKED`; Docker worker gets SMTP env fail-fast.
- Files Deleted: NONE.
- Task Completed: Phase 3 Foundation Hardening.
- Current Task: P3-004 — Tenant context switch APIs/tests.
- Runtime Applied: YES for hardening; YES for P3-003.
- Test Executed: YES — `npm install` PASS; `npm run db:validate` PASS; `npm run prisma:generate --workspace apps/api` PASS; `npm run test --workspace apps/worker` PASS 1 file / 7 tests; worker typecheck/lint/build PASS; root `npm run typecheck` PASS; root `npm run lint` PASS; `DATABASE_URL=... npm test` PASS 19 files / 57 tests; root `npm run build` PASS after sandbox retry; `docker compose config` PASS.
- API Contract Decision: P3-004 must follow source-of-truth `/api/v1/...` convention; current unversioned Phase 3 routes are legacy runtime drift and should not be extended as a new convention.
- Next Exact Action: Implement P3-004 tenant context switch APIs/tests using canonical `/api/v1/tenant-context/switch`; do not start P3-005 or Phase 4.
