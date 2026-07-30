# APLP Risk Register

## Purpose

Ghi nhận rủi ro Phase 0 và hướng xử lý cho Phase 1–13.

## Status

DONE for P0-014 — Risk Register.

- Không tự sửa runtime.
- Không tự approve open decisions.
- Phase 0 sign-off vẫn phụ thuộc P0-017/P0-018.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Risk Model

| Field | Meaning |
|---|---|
| Probability | LOW/MEDIUM/HIGH |
| Impact | LOW/MEDIUM/HIGH/CRITICAL |
| Status | OPEN/MITIGATED/ACCEPTED/NEEDS_APPROVAL |

## Risk Register

| Risk ID | Category | Risk | Probability | Impact | Mitigation | Owner | Phase | Status |
|---|---|---|---|---|---|---|---|---|
| R-001 | Scope | Product vision quá rộng làm lệch thesis slice | MEDIUM | HIGH | Four-scope separation + P0-016 handoff | Architect | Phase 0/1 | MITIGATED |
| R-002 | Runtime mismatch | Pre-existing runtime schema dùng `users.tenant_id` vi phạm global account | HIGH | HIGH | Keep source invariant; correction plan after sign-off | M02/M03 | Phase 1/2/3 | OPEN |
| R-003 | Authorization | Role-only checks thiếu relationship/state | MEDIUM | HIGH | ADR-005 + security evidence plan | M04 + business modules | Phase 4+ | OPEN |
| R-004 | Concurrency | Approval retry/concurrent tạo duplicate Project/Topic/Version | MEDIUM | HIGH | unique/lock/idempotency tests | M01/M08/M09/M11 | Phase 7/8/10 | OPEN |
| R-005 | Evidence | Test source bị nhầm là executed evidence | MEDIUM | HIGH | Evidence status model; require logs/reports | QA/Architect | All phases | MITIGATED |
| R-006 | Storage security | Presigned URL/object key leak | MEDIUM | HIGH | direct upload ADR + redaction tests | M11/M16 | Phase 10/13 | OPEN |
| R-007 | Review policy | Quorum/COI/rubric chưa chốt | HIGH | MEDIUM | OD-005/006/007 retained | Product/Advisor | Phase 12 | NEEDS_APPROVAL |
| R-008 | Appeal policy | Deadline/appeal detail chưa chốt | HIGH | MEDIUM | OD-003 retained; baseline blocks details only | Product/Advisor | Phase 12 | NEEDS_APPROVAL |
| R-009 | File scanning | Scan level unclear | MEDIUM | MEDIUM | OD-004; can start with deferred/manual baseline | Advisor | Phase 10 | NEEDS_APPROVAL |
| R-010 | Search/AI creep | Optional capability promoted too early | MEDIUM | HIGH | ADR-011 + gate OD-008/009 | Architect | After Phase 13 | MITIGATED |
| R-011 | Worker boundary | Worker mutates business aggregate directly | MEDIUM | HIGH | ADR-010 + SQL audit | M01 + modules | Phase 1/13 | OPEN |
| R-012 | Data ownership | Runtime-only tables accepted silently | MEDIUM | HIGH | P0-008/P0-010 findings + change control | Architect | P0-017/Phase 1 | OPEN |
| R-013 | Demo readiness | School/student/advisor info missing | HIGH | MEDIUM | OD-010 before final submission | Product/Advisor | Phase 13/submission | NEEDS_APPROVAL |
| R-014 | Migration confidence | Migration files exist but not applied in verified DB | MEDIUM | HIGH | Phase evidence migration report | M01 | Phase 1+ | OPEN |
| R-015 | Phase sequencing | Phase 1 starts before Phase 0 sign-off | LOW | HIGH | PROJECT_STATUS gate | Architect | Phase 0 | MITIGATED |

## Top Risks for Phase 1 Handoff

| Priority | Risk | Required Action |
|---|---|---|
| 1 | Runtime identity/tenant mismatch | Decide correction plan before implementing Phase 2/3. |
| 2 | Evidence overclaim | Require executed logs before marking phase done. |
| 3 | Authorization depth | Keep deny-by-default + resource/state relationship tests. |
| 4 | Transaction/idempotency correctness | Start foundation primitives before domain transitions. |

## Change Control

| Change ID | Requested Risk Change | Impact | Approval Status |
|---|---|---|---|
| RKC-001 | Downgrade `users.tenant_id` risk without correction | Identity/security | NEEDS_APPROVAL |
| RKC-002 | Remove Search/AI creep risk | Scope | NEEDS_APPROVAL |

## Validation Checklist

| Check | Result |
|---|---|
| Runtime mismatch risks recorded | PASS |
| Open policy risks recorded | PASS |
| Search/AI scope risk recorded | PASS |
| No runtime edit | PASS |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — risk register, roadmap, evidence.
- `docs/phase-0/DATABASE_MANIFEST_AUDIT.md`
- `docs/phase-0/BUSINESS_INVARIANTS.md`
- `docs/phase-0/TRACEABILITY_AUDIT.md`

