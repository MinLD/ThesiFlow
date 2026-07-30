# Phase 1 Plan — Foundation

## Session Rule

Khi bắt đầu session mới, AI phải đọc theo thứ tự:

1. `docs/BaoCaoKhoaLuan.docx`
2. `docs/ROADMAP.md`
3. File PLAN của Current Phase
4. File CODE của Current Phase
5. Repository hiện tại

Sau khi đọc: xác định Current Phase, Current Task, task cuối cùng đã hoàn thành, code cuối cùng đã viết, code đã áp dụng runtime hay chưa; không làm lại task đã hoàn thành; tiếp tục đúng Next Exact Action; cuối session cập nhật lại `docs/ROADMAP.md`, PLAN và CODE. Không chỉ tin Markdown; phải kiểm tra repository trước khi viết tiếp.

## Current Progress

- Current Phase: Phase 1 — Foundation
- Phase Status: DONE
- Current Task: COMPLETED
- Last Completed Task: P1-014 — Phase 1 Evidence and Verification
- Next Exact Action: Continue Phase 2 in `docs/phases/phase-2/PHASE_2_PLAN.md`.
- Runtime Applied: YES
- Source Basis: `docs/BaoCaoKhoaLuan.docx` Chương 7.1 Phase 1; stack and constraints from thesis text.

## Repository Reality Check

| Area | Exists Now | Phase 1 Fit | Action |
|---|---|---|---|
| npm workspaces | `apps/api`, `apps/web`, `apps/worker` | Fits Phase 1 | Keep; validate scripts. |
| API | Express app, health routes, request ID, error handler | Mostly Phase 1 | Tighten contracts/tests. |
| Web | Next.js health/status shell | Fits Phase 1 if no auth/domain UI | Keep foundation-only. |
| Worker | `apps/worker/src/index.ts` polling outbox | Fits Phase 1 direction | Draft safer claim/publish module and tests. |
| Prisma foundation tables | `SystemConfiguration`, `IdempotencyRecord`, `OutboxEvent` | Fits Phase 1 | Verify constraints and evidence. |
| Auth/tenant/RBAC scaffold | `users`, `tenants`, auth module, roles | Belongs Phase 2–4 | Do not extend in Phase 1; isolate/reconcile. |
| Audit table | `audit_logs` tied to old user/tenant model | Partly Phase 13, foundation support only | Draft safe audit contract, no full audit workflow. |
| Tests | API unit/Supertest tests exist | Phase 1 verified | `npm run phase1:check` and `npm run build` PASS. |

## Task Summary

| Task | Nội dung | Code Draft | Runtime | Test | Trạng thái |
|---|---|---|---|---|---|
| P1-001 | Repository/Foundation Reconciliation | DONE | YES | YES | VERIFIED |
| P1-002 | Workspace and Validation Baseline | DONE | YES | YES | VERIFIED |
| P1-003 | Configuration Validation | DONE | YES | YES | VERIFIED |
| P1-004 | Request Context and Error Envelope | DONE | YES | YES | VERIFIED |
| P1-005 | Logging Redaction | DONE | YES | YES | VERIFIED |
| P1-006 | PostgreSQL/Prisma Foundation Check | DONE | YES | YES | VERIFIED |
| P1-007 | Idempotency Primitive | DONE | YES | YES | VERIFIED |
| P1-008 | Transactional Outbox Primitive | DONE | YES | YES | VERIFIED |
| P1-009 | Worker Outbox Polling | DONE | YES | YES | VERIFIED |
| P1-010 | System Configuration Primitive | DONE | YES | YES | VERIFIED |
| P1-011 | Audit Foundation Contract | DONE | YES | YES | VERIFIED |
| P1-012 | Health, Readiness and Metadata | DONE | YES | YES | VERIFIED |
| P1-013 | Frontend Foundation Shell/API Client | DONE | YES | YES | VERIFIED |
| P1-014 | Phase 1 Evidence and Verification | DONE | YES | YES | VERIFIED |

## Task Details

### P1-001 — Repository/Foundation Reconciliation

- Status: VERIFIED
- Mục tiêu: Ghi rõ runtime hiện có, phân loại phần đúng Phase 1 và phần lệch Phase 2–4.
- Tại sao cần làm: Repository đã có auth/tenant/RBAC scaffold trước khi hệ thống tracking mới được đơn giản hóa; Phase 1 không được mở rộng nhầm domain sau.
- Phụ thuộc task nào: Phase 0 DONE.
- Những file dự kiến tạo: none; reconciliation note stays in this PLAN and `PHASE_1_CODE.md`.
- Những file dự kiến sửa: none runtime; `docs/ROADMAP.md`, `PHASE_1_PLAN.md`, `PHASE_1_CODE.md` only while planning.
- Database/migration liên quan: Inspect `apps/api/prisma/schema.prisma` and existing migrations; no migration applied by this task.
- Backend liên quan: Inspect API/worker modules; no runtime edit in draft mode.
- Frontend liên quan: Inspect foundation shell only.
- Worker liên quan: Inspect outbox worker boundary.
- Test cần viết: none; validation is repository inspection command log.
- Điều kiện hoàn thành: This PLAN records current fit/gap list and forbidden Phase 1 extensions.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-001.
- Next Task: P1-002.

### P1-002 — Workspace and Validation Baseline

- Status: VERIFIED
- Mục tiêu: Chuẩn hóa script kiểm tra Phase 1 mà không thêm dependency.
- Tại sao cần làm: Các session sau cần một lệnh nhỏ kiểm tra workspace/foundation nhất quán.
- Phụ thuộc task nào: P1-001.
- Những file dự kiến tạo: none.
- Những file dự kiến sửa: `package.json`.
- Database/migration liên quan: `db:validate` giữ nguyên.
- Backend liên quan: Typecheck/lint/test API.
- Frontend liên quan: Typecheck/lint/build web qua workspace scripts nếu có.
- Worker liên quan: Typecheck/build worker qua workspace scripts nếu có.
- Test cần viết: none cho script one-liner.
- Điều kiện hoàn thành: `phase1:check` chạy DB validate, typecheck, lint, tests.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-002.
- Next Task: P1-003.

### P1-003 — Configuration Validation

- Status: VERIFIED
- Mục tiêu: Đảm bảo env fail-fast, không leak secret value, hỗ trợ API/worker/web foundation config.
- Tại sao cần làm: Phase 1 là nền reliability; config sai phải fail sớm trước domain workflows.
- Phụ thuộc task nào: P1-002.
- Những file dự kiến tạo: `apps/api/tests/env.test.ts` update only if needed.
- Những file dự kiến sửa: `apps/api/src/config/env.ts`, `.env.example`.
- Database/migration liên quan: none.
- Backend liên quan: API config parser.
- Frontend liên quan: none in this task.
- Worker liên quan: none in this task; worker env later P1-009.
- Test cần viết: env parse rejects missing/short secrets and accepts valid test env.
- Điều kiện hoàn thành: Env tests pass; error message contains keys, not secret values.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-003.
- Next Task: P1-004.

### P1-004 — Request Context and Error Envelope

- Status: VERIFIED
- Mục tiêu: Chuẩn hóa request ID/correlation ID và error envelope ổn định.
- Tại sao cần làm: Tất cả API Phase sau cần traceable request/error contract.
- Phụ thuộc task nào: P1-003.
- Những file dự kiến tạo: none or test updates.
- Những file dự kiến sửa: `apps/api/src/common/middleware/requestId.ts`, `apps/api/src/common/types/express.d.ts`, `apps/api/src/common/middleware/errorHandler.ts`, related tests.
- Database/migration liên quan: none.
- Backend liên quan: Express middleware/error handler.
- Frontend liên quan: API client later consumes envelope.
- Worker liên quan: none.
- Test cần viết: request ID sanitization, correlation ID echo, unknown error safety.
- Điều kiện hoàn thành: Supertest proves headers and error envelope.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-004.
- Next Task: P1-005.

### P1-005 — Logging Redaction

- Status: VERIFIED
- Mục tiêu: Redact password/token/cookie/secret/presigned URL data from logs.
- Tại sao cần làm: Phase 1 logging phải an toàn trước auth/upload phases.
- Phụ thuộc task nào: P1-003.
- Những file dự kiến tạo: `apps/api/src/common/logger/redact.ts` if current logger insufficient.
- Những file dự kiến sửa: `apps/api/src/common/logger/logger.ts`, logger tests.
- Database/migration liên quan: none.
- Backend liên quan: common logger.
- Frontend liên quan: none.
- Worker liên quan: may reuse same redaction idea later.
- Test cần viết: nested metadata redaction.
- Điều kiện hoàn thành: Unit tests prove no sensitive values in log payload.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-005.
- Next Task: P1-006.

### P1-006 — PostgreSQL/Prisma Foundation Check

- Status: VERIFIED
- Mục tiêu: Verify foundation tables/constraints without adding domain schema.
- Tại sao cần làm: Database is source of truth for idempotency/outbox/config primitives.
- Phụ thuộc task nào: P1-001.
- Những file dự kiến tạo: none; database check result stays in this PLAN/CODE tracker.
- Những file dự kiến sửa: Prisma schema/migration only if missing Phase 1 constraints and approved.
- Database/migration liên quan: `system_configurations`, `idempotency_records`, `outbox_events`.
- Backend liên quan: Prisma client validation.
- Frontend liên quan: none.
- Worker liên quan: outbox table supports worker.
- Test cần viết: migration status/fresh DB check later.
- Điều kiện hoàn thành: PLAN/CODE tracker records existing/missing constraints and migration command results.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-006.
- Next Task: P1-007.

### P1-007 — Idempotency Primitive

- Status: VERIFIED
- Mục tiêu: Scoped idempotency record service with request hash conflict/replay semantics.
- Tại sao cần làm: Later approval/create commands must tolerate retry safely.
- Phụ thuộc task nào: P1-006.
- Những file dự kiến tạo: `apps/api/src/common/idempotency/idempotency.service.ts`, integration tests.
- Những file dự kiến sửa: none unless schema names mismatch.
- Database/migration liên quan: `idempotency_records` unique scope/key.
- Backend liên quan: service/repository helper.
- Frontend liên quan: none.
- Worker liên quan: none.
- Test cần viết: same key+payload replay; same key+different payload conflict.
- Điều kiện hoàn thành: Integration tests pass on PostgreSQL.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-007.
- Next Task: P1-008.

### P1-008 — Transactional Outbox Primitive

- Status: VERIFIED
- Mục tiêu: Create outbox events in the same DB transaction as a future business mutation.
- Tại sao cần làm: Worker delivery must not replace transaction/audit evidence.
- Phụ thuộc task nào: P1-006.
- Những file dự kiến tạo: `apps/api/src/common/outbox/outbox.repository.ts`, tests.
- Những file dự kiến sửa: none unless schema names mismatch.
- Database/migration liên quan: `outbox_events`.
- Backend liên quan: repository with transaction client.
- Frontend liên quan: none.
- Worker liên quan: consumed by P1-009.
- Test cần viết: rollback means no outbox event persists.
- Điều kiện hoàn thành: Atomicity integration test passes.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-008.
- Next Task: P1-009.

### P1-009 — Worker Outbox Polling

- Status: VERIFIED
- Mục tiêu: Worker claims/retries outbox events without owning business aggregates.
- Tại sao cần làm: Thesis locks worker as separate process, not microservice.
- Phụ thuộc task nào: P1-008.
- Những file dự kiến tạo: `apps/worker/src/outboxWorker.ts`, worker tests if package supports.
- Những file dự kiến sửa: `apps/worker/src/index.ts`.
- Database/migration liên quan: `outbox_events` status/attempt fields.
- Backend liên quan: none.
- Frontend liên quan: none.
- Worker liên quan: claim loop, publish stub, graceful shutdown.
- Test cần viết: claim limit, retry/failure status, no aggregate mutation.
- Điều kiện hoàn thành: Worker test/evidence shows bounded claim and safe retry.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-009.
- Next Task: P1-010.

### P1-010 — System Configuration Primitive

- Status: VERIFIED
- Mục tiêu: Read active system configuration safely.
- Tại sao cần làm: Later phases need simple policy/config values without hard-code sprawl.
- Phụ thuộc task nào: P1-006.
- Những file dự kiến tạo: `apps/api/src/modules/system/system.service.ts`, tests if missing.
- Những file dự kiến sửa: existing `apps/api/src/modules/system/system.repository.ts` if needed.
- Database/migration liên quan: `system_configurations`.
- Backend liên quan: service/repository.
- Frontend liên quan: none.
- Worker liên quan: none.
- Test cần viết: active config read and missing key behavior.
- Điều kiện hoàn thành: Integration tests pass.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-010.
- Next Task: P1-011.

### P1-011 — Audit Foundation Contract

- Status: VERIFIED
- Mục tiêu: Define minimal audit event contract and redaction boundary; no full audit timeline.
- Tại sao cần làm: Critical mutations in later phases need consistent audit metadata.
- Phụ thuộc task nào: P1-005.
- Những file dự kiến tạo: `apps/api/src/common/audit/auditEvent.ts`.
- Những file dự kiến sửa: none initially.
- Database/migration liên quan: existing `audit_logs` reviewed but not expanded unless approved.
- Backend liên quan: type contract only.
- Frontend liên quan: none.
- Worker liên quan: none.
- Test cần viết: type/unit redaction once persistence added.
- Điều kiện hoàn thành: Contract exists, no tenant/auth coupling introduced in Phase 1.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-011.
- Next Task: P1-012.

### P1-012 — Health, Readiness and Metadata

- Status: VERIFIED
- Mục tiêu: Stable `/health`, `/ready`, `/api/v1/meta` foundation APIs.
- Tại sao cần làm: Phase handoff and Docker/local validation need observable status.
- Phụ thuộc task nào: P1-004.
- Những file dự kiến tạo: none unless tests missing.
- Những file dự kiến sửa: `apps/api/src/modules/health/*`, tests.
- Database/migration liên quan: readiness DB ping.
- Backend liên quan: health controller/service/types.
- Frontend liên quan: dev status panel may consume.
- Worker liên quan: none.
- Test cần viết: health/meta/readiness envelope tests.
- Điều kiện hoàn thành: Supertest passes and no secret/internal leak.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-012.
- Next Task: P1-013.

### P1-013 — Frontend Foundation Shell/API Client

- Status: VERIFIED
- Mục tiêu: Keep Next.js shell and API client foundation-only.
- Tại sao cần làm: UI should not introduce auth/domain before backend phases.
- Phụ thuộc task nào: P1-012.
- Những file dự kiến tạo: none if current shell sufficient.
- Những file dự kiến sửa: `apps/web/src/lib/apiClient.ts`, `apps/web/src/features/health/*`, tests if configured.
- Database/migration liên quan: none.
- Backend liên quan: consumes health/meta APIs.
- Frontend liên quan: API client, error state, loading state.
- Worker liên quan: none.
- Test cần viết: later Playwright smoke when E2E configured.
- Điều kiện hoàn thành: Web build passes; no login/tenant/domain UI added.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-013.
- Next Task: P1-014.

### P1-014 — Phase 1 Evidence and Verification

- Status: VERIFIED
- Mục tiêu: Run checks and record evidence required to close Phase 1.
- Tại sao cần làm: Markdown drafts and plans are not implementation evidence.
- Phụ thuộc task nào: P1-001..P1-013 implemented.
- Những file dự kiến tạo: none; final verification summary stays in `docs/ROADMAP.md`, this PLAN and `PHASE_1_CODE.md`.
- Những file dự kiến sửa: `docs/ROADMAP.md`, `PHASE_1_PLAN.md`, `PHASE_1_CODE.md`.
- Database/migration liên quan: real PostgreSQL validation.
- Backend liên quan: API tests/build.
- Frontend liên quan: web build.
- Worker liên quan: worker build/tests.
- Test cần viết: none new; execute full Phase 1 suite.
- Điều kiện hoàn thành: ROADMAP/PLAN/CODE validation summary shows PASS; Phase 1 can be marked DONE.
- Code nằm ở phần nào trong PHASE_1_CODE.md: P1-014.
- Next Task: Phase 2 bootstrap only after Phase 1 DONE.

## Latest Session Log

- Time: 2026-07-30 Asia/Ho_Chi_Minh
- Runtime Code Changed: YES — Phase 1 implemented.
- Code Draft Completed: P1-001..P1-014.
- Task Completed: P1-014 — Phase 1 Evidence and Verification.
- Current Task: Phase 2 bootstrap.
- Runtime Applied: YES — Phase 1 implemented.
- Test Executed: YES — `npm run phase1:check` PASS; `npm run build` PASS.
- Next Exact Action: Continue Phase 2 in `docs/phases/phase-2/PHASE_2_PLAN.md`.
