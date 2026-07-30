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

- Current Phase: Phase 1 — Foundation, monorepo, PostgreSQL, worker, outbox và test foundation
- Current Phase Status: IN_PROGRESS
- Current Task: P1-005 — Logging Redaction
- Last Completed Task: P1-004 — Request Context and Error Envelope code draft completed in Markdown only
- Next Exact Action: Write P1-005 `DRAFT_NOT_APPLIED` logging redaction code in `docs/phases/phase-1/PHASE_1_CODE.md`; do not edit runtime source until implementation mode is explicitly approved.
- Official Daily Status Source: `docs/ROADMAP.md`
- Current Phase Plan: `docs/phases/phase-1/PHASE_1_PLAN.md`
- Current Phase Code Drafts: `docs/phases/phase-1/PHASE_1_CODE.md`
- Runtime Code Changed In Latest Session: NO
- Test Executed In Latest Session: NO

## Source References

- Source of truth: `docs/BaoCaoKhoaLuan.docx`, Chương 7.1 Roadmap tổng quát, Bảng Roadmap Phase 0-13.
- Phase 0 approved references retained: `docs/phase-0/PHASE_0_SIGN_OFF.md`, `docs/phase-0/adr/`, `docs/phase-0/OPEN_DECISIONS.md`.
- Phase 1 notes are tracked in `docs/phases/phase-1/PHASE_1_PLAN.md` and `docs/phases/phase-1/PHASE_1_CODE.md`; no separate Phase 1 evidence folder is used.

## Phase Roadmap

| Phase | Tên | Mục tiêu chính | Nhóm chức năng chính | Điều kiện hoàn thành | Trạng thái |
|---|---|---|---|---|---|
| Phase 0 | Architecture reconciliation và scope freeze | Đóng băng bốn lớp phạm vi, thuật ngữ, invariant, module boundary, Database Capability Manifest và evidence plan | Scope, stack, module boundaries, ADR, risk, evidence, sign-off | Phase 0 sign-off recorded and approved | DONE |
| Phase 1 | Foundation, monorepo, PostgreSQL, worker, outbox và test foundation | Dựng nền tảng chạy được và các primitive độ tin cậy trước domain | Workspace, config, PostgreSQL/Prisma, request ID, error envelope, logging/redaction, idempotency, outbox, worker, system config, health, test foundation | Foundation tests/evidence pass; no domain workflow added; runtime reconciliation complete | IN_PROGRESS |
| Phase 2 | Global account authentication | Có account toàn cục và session an toàn, chưa gắn cứng tenant | Accounts, credentials, tokens, sessions, auth API/UI | Global auth works; no account tenant coupling; security tests pass | NOT_STARTED |
| Phase 3 | Organization/Tenant onboarding | Tạo biên tổ chức và membership rõ nguồn | Organizations, tenant memberships, invitations, tenant context switch | Active membership context verified; tenant isolation baseline pass | NOT_STARTED |
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
| `docs/phase-0/PHASE_0_SIGN_OFF.md` | Approved sign-off; must not be lost. |
| `docs/phase-0/adr/` | Approved architectural decisions. |
| `docs/phase-0/OPEN_DECISIONS.md` | Open decisions not yet transferred into runtime rules. |
| `docs/phase-0/*.md` | Phase 0 reference/audit artifacts; not daily tracking. |
| `docs/PROJECT_STATUS.md` | Reduced pointer to this roadmap for compatibility only; not official status. |

## Latest Session Log

- Time: 2026-07-30 Asia/Ho_Chi_Minh
- Executor: Codex CLI
- Work Performed: Created simplified roadmap/status source; moved daily tracking to `docs/ROADMAP.md`, Phase 1 plan to `docs/phases/phase-1/PHASE_1_PLAN.md`, and Phase 1 code drafts to `docs/phases/phase-1/PHASE_1_CODE.md`.
- Runtime Code Changed: NO
- Files Deleted: `docs/MASTER_IMPLEMENTATION_ROADMAP.md`; obsolete Phase 1 evidence folder.
- Task Completed: P1-004 — Request Context and Error Envelope code draft.
- Current Task: P1-005 — Logging Redaction.
- Runtime Applied: NO.
- Test Executed: NO.
- Next Exact Action: Write P1-005 `DRAFT_NOT_APPLIED` logging redaction code in `docs/phases/phase-1/PHASE_1_CODE.md`; do not edit runtime source until implementation mode is explicitly approved.
