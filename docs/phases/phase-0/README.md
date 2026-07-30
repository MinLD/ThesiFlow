# APLP Phase 0 Index

## Purpose

Index các artifact Phase 0 để AI/coder tiếp theo đọc đúng thứ tự, không dựa vào lịch sử hội thoại.

## Status

READY FOR PHASE 0 CONSISTENCY REVIEW. Phase 0 chưa DONE nếu `PHASE_0_SIGN_OFF.md` chưa được người có thẩm quyền approve.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Artifact Order

| Order | Artifact | Task | Status |
|---|---|---|---|
| 1 | `docs/PROJECT_STATUS.md` | P0-001 | DONE |
| 2 | `docs/phase-0/SOURCE_HIERARCHY.md` | P0-002 | DONE |
| 3 | `docs/phase-0/SCOPE_FREEZE.md` | P0-003 | DONE |
| 4 | `docs/phase-0/STACK_LOCK.md` | P0-004 | DONE |
| 5 | `docs/phase-0/MODULE_BOUNDARIES.md` | P0-005/P0-006 | DONE |
| 6 | `docs/phase-0/MODULE_DEPENDENCIES.md` | P0-007 | DONE |
| 7 | `docs/phase-0/DATABASE_MANIFEST_AUDIT.md` | P0-008 | DONE |
| 8 | `docs/phase-0/BUSINESS_INVARIANTS.md` | P0-009 | DONE |
| 9 | `docs/phase-0/TRACEABILITY_AUDIT.md` | P0-010 | DONE |
| 10 | `docs/phase-0/adr/*.md` | P0-011 | DONE after validation |
| 11 | `docs/phase-0/ERROR_CONTRACT_BASELINE.md` | P0-012 | DONE after validation |
| 12 | `docs/phase-0/EVIDENCE_PLAN.md` | P0-013 | DONE after validation |
| 13 | `docs/phase-0/RISK_REGISTER.md` | P0-014 | DONE after validation |
| 14 | `docs/phase-0/OPEN_DECISIONS.md` | P0-015 | DONE after validation |
| 15 | `docs/phase-0/PHASE_1_HANDOFF.md` | P0-016 | DONE after validation |
| 16 | `docs/phase-0/CONSISTENCY_AUDIT.md` | P0-017 | DONE after validation |
| 17 | `docs/phase-0/PHASE_0_SIGN_OFF.md` | P0-018 | DONE |

## Guardrails

- Phase 0 creates documentation only.
- Do not modify runtime code, Prisma schema, migration, seed, worker SQL, API route or UI.
- Do not mark Phase 1 IN_PROGRESS before approved sign-off.
- Do not approve OD-001 đến OD-010 without authority.

## Source References

- `docs/BaoCaoKhoaLuan.docx`
- `AGENTS.md`
- `docs/PROJECT_STATUS.md`
