# APLP Evidence Plan

## Purpose

Khóa kế hoạch bằng chứng cần có để chứng minh implementation theo FR/API/UI/database/invariant. Đây là kế hoạch evidence, không phải executed evidence.

## Status

DONE for P0-013 — Evidence Plan.

- Phase 0 vẫn IN_PROGRESS cho tới consistency audit và sign-off.
- Không chạy test runtime trong P0-013.
- Không ghi `EXECUTED_PASS` nếu chưa có report/log/artifact thật.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Evidence Principles

- Design traceability khác implementation evidence.
- Test source khác executed evidence.
- Migration file khác applied database evidence.
- UI screenshot khác E2E pass.
- Security evidence phải gồm negative case.
- Concurrency evidence cần real PostgreSQL hoặc harness tương đương.

## Evidence Status Model

| Status | Meaning |
|---|---|
| PLANNED | Evidence required but not created/executed. |
| ARTIFACT_OBSERVED | Source/test/runtime artifact exists; not executed. |
| EXECUTED_PASS | Execution report/log observed pass. |
| EXECUTED_FAIL | Execution report/log observed fail. |
| NOT_IMPLEMENTED | No implementation artifact. |
| NEEDS_APPROVAL | Policy gate blocks exact expected evidence. |

## Phase Evidence Matrix

| Phase | Evidence Required Before Done | Primary Tools | Status |
|---|---|---|---|
| 1 Foundation | PostgreSQL migration apply, health/readiness, outbox/idempotency tests, redaction check, worker smoke | Vitest/Jest, Supertest, PostgreSQL, worker log | PLANNED |
| 2 Identity | Register/login/refresh/reset/logout API, token rotation/reuse, credential redaction, global account no tenantId | Supertest, security tests | PLANNED |
| 3 Tenancy | Organization/membership/invitation, active membership tenant context, cross-tenant deny | integration + API/security | PLANNED |
| 4 Authorization | role/permission/scope, deny-by-default, privilege escalation negative tests | API/security | PLANNED |
| 5 Academic | hierarchy cycle, placement overlap/history, student cannot create structure | integration + API | PLANNED |
| 6 Campaign | template version immutability, campaign pin, state transitions | unit + API + DB | PLANNED |
| 7 Topic | approve idempotency/concurrency, decision evidence, rejected cannot register | integration + concurrency | PLANNED |
| 8 Project | registration member uniqueness, one project per approved registration, rollback | integration + concurrency | PLANNED |
| 9 Work | membership/supervision/progress append-only | API + E2E slice | PLANNED |
| 10 Documents | direct upload, metadata/checksum/MIME/size/expiry, tenant object isolation, download reauth | file/security/E2E | PLANNED |
| 11 Submission/Feedback | submission pins version, V2 not mutate V1, feedback exact target | integration + E2E | PLANNED |
| 12 Review/Evaluation | rubric/review pinning, score range/version, finalize guard, appeal/amendment | integration + API + E2E | PLANNED/NEEDS_APPROVAL |
| 13 Hardening | notification/outbox retry, audit redaction, full THESIS E2E, cross-tenant deny report | Playwright + reports | PLANNED |
| Search/AI gate | permission-aware search/AI advisory evidence only if approved | post-Phase-13 plan | NEEDS_APPROVAL |

## Required Test Inventory

| Evidence ID | Requirement/Invariants | Test Level | Required Artifact | Execution Status |
|---|---|---|---|---|
| EV-001 | DB manifest CORE constraints | Integration | PostgreSQL migration apply report + schema inspection | PLANNED |
| EV-002 | INV-FND-001 outbox atomicity | Integration/worker | rollback + worker dispatch-after-commit test | PLANNED |
| EV-003 | INV-FND-002 idempotency | API/integration | replay same payload and conflict different payload | PLANNED |
| EV-004 | INV-FND-004 redaction | Unit/API/log | password/token/presigned URL redaction test | PLANNED |
| EV-005 | INV-ID-001 global account | DB/API/security | account has no tenantId + tenant context membership tests | PLANNED; runtime mismatch observed |
| EV-006 | INV-TEN-004 tenant isolation | API/security/E2E | cross-tenant deny + IDOR tests | PLANNED |
| EV-007 | INV-AUTH-001 deny default | API/security | missing permission/scope/state denies | PLANNED |
| EV-008 | INV-ACD-002 hierarchy | Unit/integration | cycle/type invalid rejected | PLANNED |
| EV-009 | INV-ACD-003 placement history | Integration | no overlap/append history test | PLANNED/NEEDS_APPROVAL |
| EV-010 | INV-CAM-001..004 campaign | API/integration | version immutable + state transition tests | PLANNED |
| EV-011 | INV-TOP-001 topic approve | Concurrency | concurrent approve creates one topic | PLANNED |
| EV-012 | INV-PRJ-001 project creation | Concurrency | concurrent registration approval creates one project | PLANNED |
| EV-013 | INV-DOC-001..005 documents | File/security | upload complete once, object isolation, download reauth | PLANNED |
| EV-014 | INV-SUB-001 submission pin | Integration/E2E | V1 remains pinned after V2 | PLANNED |
| EV-015 | INV-FB-001 feedback target | API/E2E | cannot retarget feedback | PLANNED |
| EV-016 | INV-REV-001..005 review | Integration/API | rubric immutable, assignment pinning, score version/range | PLANNED/NEEDS_APPROVAL |
| EV-017 | INV-EVA-001..005 evaluation | Integration/E2E | finalize guard, immutable result, appeal/amendment append-only | PLANNED/NEEDS_APPROVAL |
| EV-018 | INV-NOT-001 notification | Worker | outbox retry and duplicate delivery idempotency | PLANNED |
| EV-019 | INV-AUD-001..002 audit | Integration/security | critical audit atomicity + redaction | PLANNED |
| EV-020 | THESIS vertical slice | E2E | Playwright full demo report + screenshots | PLANNED |

## Runtime Evidence Baseline

| Area | Observed | Evidence Status | Follow-up |
|---|---|---|---|
| Existing API/schema/worker code | Pre-existing dirty runtime artifacts | ARTIFACT_OBSERVED | P0-017 + implementation phases |
| `users.tenant_id` | Conflicts global account invariant | EXECUTED_FAIL not claimed; design violation observed | Correction plan after sign-off |
| Prisma/migrations | Files exist | ARTIFACT_OBSERVED | Need apply/report in Phase 1+ |
| Tests | Source may exist | ARTIFACT_OBSERVED only | Need execution logs |
| MinIO/S3 | No strong runtime evidence | NOT_IMPLEMENTED/NEEDS_REVIEW | Phase 10 evidence |

## Evidence Deliverables

| Deliverable | Producer Phase | Stored As |
|---|---|---|
| Migration apply report | Phase 1+ | `docs/evidence/phase-N/migration-report.md` |
| API test report | Phase 1+ | `docs/evidence/phase-N/api-test-report.md` |
| Security test report | Phase 2+ | `docs/evidence/phase-N/security-report.md` |
| File upload report | Phase 10 | `docs/evidence/phase-10/direct-upload-report.md` |
| E2E demo report | Phase 13 | `docs/evidence/phase-13/thesis-e2e-report.md` |
| Phase sign-off evidence bundle | Each phase | `docs/evidence/phase-N/sign-off.md` |

## Change Control

| Change ID | Requested Evidence Change | Impact | Approval Status |
|---|---|---|---|
| EVC-001 | Replace real PostgreSQL integration evidence | DB/concurrency claims | NEEDS_APPROVAL |
| EVC-002 | Drop cross-tenant negative tests | Security claims | NEEDS_APPROVAL |
| EVC-003 | Treat test source as executed evidence | Validation integrity | REJECTED_BY_BASELINE |

## Validation Checklist

| Check | Result |
|---|---|
| Phase evidence matrix exists | PASS |
| Required test inventory exists | PASS |
| Runtime evidence not overstated | PASS |
| No test executed or generated | PASS |
| Open decisions preserved | PASS |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — test strategy, evidence cần chuẩn bị, roadmap.
- `docs/phase-0/TRACEABILITY_AUDIT.md`
- `docs/phase-0/BUSINESS_INVARIANTS.md`
- `docs/phase-0/ERROR_CONTRACT_BASELINE.md`

