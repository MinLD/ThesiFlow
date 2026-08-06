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
- Current Task: P3-001-B — Runtime/domain reconciliation if required after DB pass
- Last Completed Task: P3-001-A — Organization/membership database reconciliation
- Next Exact Action: Review runtime/domain needs after P3-001-A DB pass; do not start P3-002 or Phase 4 until P3-001-B is assessed.
- Official Daily Status Source: `docs/ROADMAP.md`
- Current Phase Plan: `docs/phases/phase-3/PHASE_3_PLAN.md`
- Current Phase Code Drafts: `docs/phases/phase-3/PHASE_3_CODE.md`
- Runtime Code Changed In Latest Session: YES — P3-001-A schema, migration, seed and generated Prisma client reconciled to Organization/Membership/Invitation contract
- Test Executed In Latest Session: YES — `npm run db:validate`; root `lint`; root `typecheck`; full API `test` 16 files / 46 tests PASS; root `build` PASS

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

- Time: 2026-08-04 Asia/Ho_Chi_Minh
- Executor: Codex CLI
- Work Performed: Moved auth email delivery off API request path into outbox worker.
- Runtime Code Changed: YES — API auth service enqueues `mail.send.v1`; worker claims outbox rows and sends SMTP with retry.
- Files Deleted: NONE.
- Task Completed: P2-HOTFIX — Async auth mail via outbox worker.
- Current Task: P3-001 — Organization/membership model reconciliation.
- Runtime Applied: YES for P2-001/P2-006; NO for Phase 3.
- Test Executed: YES — API/worker typecheck; API/worker lint; API/worker build; `DATABASE_URL=... npm run test --workspace apps/api -- auth/account-lifecycle.test.ts auth/session-security.test.ts auth/frontend-auth-boundary.test.ts outboxRepository.test.ts` PASS 4 files / 13 tests.
- Next Exact Action: Developer applies P3-001-A database contract from `docs/training/database-specs/2026-08-06_P3-001-A_DATABASE.md`, then makes `apps/api/tests/tenancy/organization-membership-reconciliation.test.ts` pass; do not start P3-002 or Phase 4.

- Time: 2026-08-06 Asia/Ho_Chi_Minh
- Executor: Codex CLI
- Work Performed: Applied P3-001-A database contract for `organizations`, `tenant_memberships`, `membership_invitations`; renamed role/audit tenant references to organization references; updated seed and generated Prisma client.
- Runtime Code Changed: YES — Prisma schema, Phase 3 migration, seed, generated client and adapter-aware test helper updated.
- Files Deleted: NONE.
- Task Completed: P3-001-A — Organization/membership database reconciliation.
- Current Task: P3-001-B — Runtime/domain reconciliation if required after DB pass.
- Runtime Applied: YES for P3-001-A.
- Test Executed: YES — `npm run db:validate`; `DATABASE_URL=postgresql://thesiflow:12345678@localhost:5433/thesiflow?schema=public npm run test --workspace apps/api -- tenancy/organization-membership-reconciliation.test.ts` PASS 1 file / 4 tests; root `npm run lint`; root `npm run typecheck`; full API `npm run test` PASS 16 files / 46 tests; root `npm run build` PASS.
- Next Exact Action: Review P3-001-B runtime/domain reconciliation needs; do not start P3-002 or Phase 4.
