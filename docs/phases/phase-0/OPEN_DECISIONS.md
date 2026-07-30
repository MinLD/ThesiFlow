# APLP Open Decisions

## Purpose

Tổng hợp các quyết định chưa được phê duyệt trước/sau Phase 0.

## Status

DONE for P0-015 — Open Decisions baseline.

- Không decision nào trong OD-001..OD-010 được tự approve.
- Phase 1 có thể chuẩn bị nếu P0-018 xác nhận các OD không chặn foundation.
- Các OD ảnh hưởng later phases vẫn giữ NEEDS_APPROVAL.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Decision Status Model

| Status | Meaning |
|---|---|
| NEEDS_APPROVAL | Cần người có thẩm quyền quyết định. |
| BLOCKS_PHASE_1 | Chặn Phase 1 nếu chưa quyết. |
| BLOCKS_LATER_PHASE | Không chặn Phase 1, chặn phase liên quan. |
| APPROVED | Chỉ dùng khi có explicit approval recorded. |
| REJECTED | Chỉ dùng khi có explicit rejection recorded. |

## Open Decision Register

| Decision ID | Vấn đề | Current Baseline | Missing Decision | Blocks Phase 1? | Blocks Which Phase | Status |
|---|---|---|---|---|---|---|
| OD-001 | Graduation Implementation Slice cuối cùng | THESIS vertical slice 13 bước trong traceability/handoff | Xác nhận slice cuối cùng với advisor/hội đồng | NO for foundation | Phase 13/demo | NEEDS_APPROVAL |
| OD-002 | Class/Cohort CORE hay OPTIONAL | Giữ OPTIONAL theo source audit | Promote hay giữ optional | NO | Phase 5/demo data | NEEDS_APPROVAL |
| OD-003 | Appeal và deadline policy | Deadline/appeal có baseline direction, chi tiết chưa chốt | Timezone, grace, attempt, appeal window | NO | Phase 11/12 | NEEDS_APPROVAL |
| OD-004 | File scanning level | Manual/deferred unless approved | Scan service, sync/async, block/quarantine behavior | NO | Phase 10 | NEEDS_APPROVAL |
| OD-005 | Rubric policy | Published rubric immutable + pinning | Scale, weights, correction workflow detail | NO | Phase 12 | NEEDS_APPROVAL |
| OD-006 | Quorum policy | Need quorum guard, exact rule pending | Reviewer count/quorum formula | NO | Phase 12 | NEEDS_APPROVAL |
| OD-007 | Conflict-of-interest policy | COI must not be bypassed, detail pending | COI roles/rules/override evidence | NO | Phase 12 | NEEDS_APPROVAL |
| OD-008 | Search go/no-go | Optional after Phase 13 gate | Build/no-build decision | NO | After Phase 13 | NEEDS_APPROVAL |
| OD-009 | AI/RAG go/no-go | Optional advisory-only after Phase 13 gate | Build/no-build decision and safety policy | NO | After Phase 13 | NEEDS_APPROVAL |
| OD-010 | School/student/advisor information | Placeholders remain in source front matter | Real institution/name/MSSV/advisor | NO for implementation | Final submission | NEEDS_APPROVAL |

## Phase Blocking Summary

| Phase | Blocking Decisions | Notes |
|---|---|---|
| Phase 1 | None identified | Foundation can start after sign-off approval. |
| Phase 2–4 | None identified | Global account/auth baseline locked; runtime mismatch must be corrected by implementation. |
| Phase 5 | OD-002 | Only blocks class/cohort detail. |
| Phase 10 | OD-004 | Blocks scanning behavior, not direct upload baseline. |
| Phase 11–12 | OD-003, OD-005, OD-006, OD-007 | Blocks detailed policy/evidence. |
| Phase 13 | OD-001, OD-010 | Blocks final demo/submission polish. |
| After Phase 13 | OD-008, OD-009 | Optional gates. |

## Change Control

| Change ID | Decision | Requested Change | Approval Status |
|---|---|---|---|
| ODC-001 | Any OD | Mark approved without explicit authority | REJECTED_BY_BASELINE |
| ODC-002 | OD-008/009 | Promote Search/AI into core | NEEDS_APPROVAL |
| ODC-003 | OD-002 | Promote Class/Cohort to CORE manifest | NEEDS_APPROVAL |

## Validation Checklist

| Check | Result |
|---|---|
| OD-001..OD-010 present | PASS |
| No OD auto-approved | PASS |
| Phase blocking noted | PASS |
| Phase 1 blockers separated from later blockers | PASS |

## Source References

- `docs/BaoCaoKhoaLuan.docx` — open decisions/evidence placeholders.
- `docs/PROJECT_STATUS.md`
- `docs/phase-0/SCOPE_FREEZE.md`
- `docs/phase-0/TRACEABILITY_AUDIT.md`
- `docs/phase-0/RISK_REGISTER.md`

