# APLP Error Contract Baseline

## Purpose

Khóa hướng error contract Phase 0 cho API/UI/test. Đây là baseline thiết kế, không phải implementation evidence.

## Status

DONE for P0-012 — Error Contract Baseline.

- Phase 0 vẫn IN_PROGRESS cho tới consistency audit và sign-off.
- Không tạo runtime error code, middleware hoặc test.
- Error code chi tiết có thể refine khi implementation, nhưng không được làm yếu invariant/security rule.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Error Contract Rules

- Error response phải có stable category, message an toàn, correlation id và optional field details.
- Không leak account tồn tại, credential/token, presigned URL, tenant object hoặc hidden resource.
- Authorization failure giữa `FORBIDDEN` và `NOT_FOUND_OR_HIDDEN` theo security context; P0-012 không ép một code duy nhất.
- Validation khác business conflict; invalid payload không dùng để che invalid state.
- Retry guidance phải rõ với idempotency/concurrency/worker errors.
- UI hiển thị user-safe message; audit/log giữ diagnostic đã redact.

## Response Shape Baseline

| Field | Required | Direction |
|---|---|---|
| `error.category` | YES | Stable machine category. |
| `error.message` | YES | Safe human-readable message; no secret/hidden resource leak. |
| `error.correlationId` | YES | Trace request/log/audit. |
| `error.fields` | OPTIONAL | Validation field issues only. |
| `error.retryable` | YES for commands | Boolean or policy direction. |
| `error.idempotencyKey` | OPTIONAL | Only echo safe key reference, not payload. |

## Error Category Catalog

| Category | HTTP Direction | Retry Safe | Applies To |
|---|---|---|---|
| VALIDATION | 400 | NO | Zod/body/query/param violations. |
| UNAUTHENTICATED | 401 | YES after login | Missing/invalid session. |
| FORBIDDEN | 403 | NO | Authenticated actor lacks tenant/permission/scope/relationship/state. |
| NOT_FOUND_OR_HIDDEN | 404 | NO | Missing or hidden resource; avoid IDOR leak. |
| CONFLICT | 409 | MAYBE | Unique/business duplicate. |
| INVALID_STATE | 409 | NO | Illegal transition. |
| IDEMPOTENCY_CONFLICT | 409 | NO | Same key, different payload/scope. |
| CONCURRENCY_CONFLICT | 409 | YES with refresh | Row lock/version/compare-and-set conflict. |
| VERSION_CONFLICT | 409 | NO | Wrong document/rubric/template/version target. |
| DEADLINE_VIOLATION | 409 | NO | Submission/appeal outside policy window. |
| TARGET_IMMUTABLE | 409 | NO | Attempt to mutate published/submitted/finalized official record. |
| POLICY_NOT_SATISFIED | 422 | NO | Quorum/COI/capacity/eligibility missing. |
| STORAGE_ERROR | 502/503 | YES if idempotent | MinIO/S3-compatible transient failure. |
| WORKER_RETRY_EXHAUSTED | 500/503 | YES by worker policy | Async delivery reached retry ceiling. |
| INTERNAL | 500 | UNKNOWN | Unexpected server failure; redact details. |

## Domain Error Direction Matrix

| Domain | Key APIs/Flows | Invariants | Expected Categories | UI Direction | Test Evidence |
|---|---|---|---|---|---|
| Foundation | health, idempotent commands, outbox worker | INV-FND-001..005 | IDEMPOTENCY_CONFLICT, CONCURRENCY_CONFLICT, WORKER_RETRY_EXHAUSTED, INTERNAL | retry/status banner; no duplicate success | unit + integration + worker crash |
| Identity | register/login/refresh/reset/logout | INV-ID-001..004 | VALIDATION, UNAUTHENTICATED, CONFLICT, NOT_FOUND_OR_HIDDEN | generic auth failure; no enumeration | API/security |
| Tenancy | organization, membership, invitation, tenant switch | INV-TEN-001..005 | FORBIDDEN, NOT_FOUND_OR_HIDDEN, CONFLICT, TENANT_CONTEXT_INVALID via FORBIDDEN/401 | tenant picker denied/suspended state | cross-tenant API/security |
| Authorization | role/permission/assignment/scope | INV-AUTH-001..005 | FORBIDDEN, CONFLICT, POLICY_NOT_SATISFIED | admin form errors; no self-escalation | privilege escalation/security |
| Academic | units, profiles, placements | INV-ACD-001..003 | VALIDATION, FORBIDDEN, CONFLICT, POLICY_NOT_SATISFIED | hierarchy/overlap errors | unit + integration |
| Campaign | template/version/campaign/state/participants | INV-CAM-001..004 | INVALID_STATE, TARGET_IMMUTABLE, CONFLICT | transition disabled + backend denial | API + state machine |
| Topic | proposal/decision/materialization | INV-TOP-001..003 | INVALID_STATE, CONFLICT, IDEMPOTENCY_CONFLICT | approval/request-change outcome | concurrent approval |
| Project | registration/approve/project/membership/supervision | INV-PRJ-001..004 | CONFLICT, CONCURRENCY_CONFLICT, POLICY_NOT_SATISFIED | registration capacity/approval state | concurrent approval |
| Work | milestones/progress | INV-WRK-001 | INVALID_STATE, TARGET_IMMUTABLE | append-only timeline | integration |
| Documents | upload/download/version | INV-DOC-001..005 | STORAGE_ERROR, TARGET_IMMUTABLE, VERSION_CONFLICT, FORBIDDEN | upload retry/expired/checksum/download denied | file/security |
| Submission/Feedback | submit/withdraw/feedback/thread | INV-SUB-001..002, INV-FB-001 | DEADLINE_VIOLATION, TARGET_IMMUTABLE, VERSION_CONFLICT, FORBIDDEN | deadline/version/visibility messages | API/E2E |
| Review | assignment/review/scores/rubric | INV-REV-001..005 | VERSION_CONFLICT, TARGET_IMMUTABLE, POLICY_NOT_SATISFIED, FORBIDDEN | score/rubric/version errors | integration/API |
| Evaluation | finalize/appeal/amendment/release | INV-EVA-001..005 | POLICY_NOT_SATISFIED, TARGET_IMMUTABLE, INVALID_STATE, DEADLINE_VIOLATION | release/appeal/amend state | E2E/security |
| Notification/Audit | inbox/audit timeline | INV-NOT-001, INV-AUD-001..002 | FORBIDDEN, WORKER_RETRY_EXHAUSTED | non-blocking notification state | worker/audit redaction |
| Search/AI | optional search/AI endpoints | INV-SRCH-001, INV-AI-001 | OPTIONAL_GATE, FORBIDDEN | feature-gated; advisory warning | after Phase 13 only |

## API Catalog Error Mapping

| API Range | Module | Baseline Categories | Notes |
|---|---|---|---|
| API-001..003 | M01 | INTERNAL, WORKER_RETRY_EXHAUSTED | Health/readiness/internal; no UI required. |
| API-004..012 | M02 | VALIDATION, UNAUTHENTICATED, CONFLICT, NOT_FOUND_OR_HIDDEN | No account enumeration; token/session redaction. |
| API-013..021 | M03 | FORBIDDEN, CONFLICT, NOT_FOUND_OR_HIDDEN | Tenant context from active membership only. |
| API-022..027 | M04 | FORBIDDEN, CONFLICT, POLICY_NOT_SATISFIED | No self privilege escalation. |
| API-028..036 | M05/M06 | VALIDATION, FORBIDDEN, CONFLICT | Hierarchy/cycle/placement overlap. |
| API-037..045 | M07 | INVALID_STATE, TARGET_IMMUTABLE, CONFLICT | Template version/publishing/pinning. |
| API-046..050 | M08 | INVALID_STATE, CONFLICT, IDEMPOTENCY_CONFLICT | Topic approval materializes once. |
| API-051..054 | M09 | CONFLICT, CONCURRENCY_CONFLICT, POLICY_NOT_SATISFIED | One project per approved registration. |
| API-055..058 | M10 | INVALID_STATE, FORBIDDEN | Append-only progress. |
| API-059..066 | M11 | STORAGE_ERROR, VERSION_CONFLICT, TARGET_IMMUTABLE, FORBIDDEN | Direct upload/download authorization. |
| API-067..070 | M12 | FORBIDDEN, TARGET_IMMUTABLE | Feedback pins target. |
| API-071..078 | M13 | VERSION_CONFLICT, TARGET_IMMUTABLE, POLICY_NOT_SATISFIED | Rubric/review pinning. |
| API-079..085 | M14 | INVALID_STATE, TARGET_IMMUTABLE, DEADLINE_VIOLATION, POLICY_NOT_SATISFIED | Appeal/quorum/COI open policy. |
| API-086..089 | M15/M16 | FORBIDDEN, WORKER_RETRY_EXHAUSTED | Notification side effect; audit append-only. |
| API-090..091 | M17/M18 | OPTIONAL_GATE, FORBIDDEN | After Phase 13 only. |

## Open Policy Impacts

| Decision | Error Impact | Status |
|---|---|---|
| OD-003 | Deadline/appeal exact categories/details pending. | NEEDS_APPROVAL |
| OD-004 | File scanning errors pending. | NEEDS_APPROVAL |
| OD-005 | Rubric policy violation details pending. | NEEDS_APPROVAL |
| OD-006 | Quorum failure details pending. | NEEDS_APPROVAL |
| OD-007 | COI failure details pending. | NEEDS_APPROVAL |
| OD-008 | Search gate error remains OPTIONAL_GATE. | NEEDS_APPROVAL |
| OD-009 | AI/RAG gate error remains OPTIONAL_GATE. | NEEDS_APPROVAL |

## Change Control

| Change ID | Requested Change | Impact | Approval Status |
|---|---|---|---|
| ECC-001 | Change HTTP category for hidden resource | Security/API/UI/test | NEEDS_APPROVAL |
| ECC-002 | Remove idempotency conflict | Reliability/API/test | NEEDS_APPROVAL |
| ECC-003 | Expose detailed auth failure reason | Security/UI/logging | NEEDS_APPROVAL |

## Validation Checklist

| Check | Result |
|---|---|
| Error categories defined | PASS |
| HTTP/retry direction defined | PASS |
| FR/API ranges mapped | PASS |
| Invariant violation mapped | PASS |
| Open decisions not approved | PASS |
| No runtime code changed | PASS |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — API Catalog V1.1, Permission Matrix, Error states trọng yếu.
- `docs/phase-0/BUSINESS_INVARIANTS.md`
- `docs/phase-0/TRACEABILITY_AUDIT.md`
- `docs/phase-0/adr/ADR-005-authorization.md`
- `docs/phase-0/adr/ADR-007-idempotency.md`

