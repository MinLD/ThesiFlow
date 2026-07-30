# APLP Phase 0 Consistency Audit

## Purpose

Kiểm tra toàn bộ artifact Phase 0 trước sign-off, đối chiếu scope/stack/module/database/invariant/traceability/ADR/error/evidence/risk/open/handoff.

## Status

DONE for P0-017 — Phase 0 Consistency Audit.

- Result: PASS_WITH_NON_BLOCKING_FINDINGS.
- Phase 0 chưa DONE vì P0-018 cần approval.
- Không sửa runtime code/schema/migration/seed/worker/UI/API.

## Last Updated

2026-07-30 Asia/Ho_Chi_Minh

## Audit Method

- Read-only repository inspection using `find`, `rg`, `sed`, `git status --short`, `git diff --name-only`, `git diff --stat`.
- Artifact existence and required heading checks.
- Count reconciliation by artifact-declared baseline.
- Forbidden scope phrase and Phase 1 state checks.
- Runtime mismatch preservation check from P0-008/P0-009/P0-010.

## Artifact Completeness Matrix

| Task | Artifact | Expected | Result |
|---|---|---|---|
| P0-001 | `docs/PROJECT_STATUS.md` | Status source | PASS |
| P0-002 | `docs/phase-0/SOURCE_HIERARCHY.md` | Source hierarchy | PASS |
| P0-003 | `docs/phase-0/SCOPE_FREEZE.md` | Scope freeze | PASS |
| P0-004 | `docs/phase-0/STACK_LOCK.md` | Stack lock | PASS |
| P0-005/P0-006 | `docs/phase-0/MODULE_BOUNDARIES.md` | Module/data ownership | PASS |
| P0-007 | `docs/phase-0/MODULE_DEPENDENCIES.md` | Dependency audit | PASS |
| P0-008 | `docs/phase-0/DATABASE_MANIFEST_AUDIT.md` | DB manifest audit | PASS |
| P0-009 | `docs/phase-0/BUSINESS_INVARIANTS.md` | 57 invariants | PASS |
| P0-010 | `docs/phase-0/TRACEABILITY_AUDIT.md` | Traceability audit | PASS |
| P0-011 | `docs/phase-0/adr/ADR-001..012*.md` | 12 ADR | PASS |
| P0-012 | `docs/phase-0/ERROR_CONTRACT_BASELINE.md` | Error baseline | PASS |
| P0-013 | `docs/phase-0/EVIDENCE_PLAN.md` | Evidence plan | PASS |
| P0-014 | `docs/phase-0/RISK_REGISTER.md` | Risk register | PASS |
| P0-015 | `docs/phase-0/OPEN_DECISIONS.md` | Open decisions | PASS |
| P0-016 | `docs/phase-0/PHASE_1_HANDOFF.md` | Phase 1 handoff | PASS |
| P0-017 | `docs/phase-0/CONSISTENCY_AUDIT.md` | Consistency audit | PASS |
| P0-018 | `docs/phase-0/PHASE_0_SIGN_OFF.md` | Approval gate | NEEDS_APPROVAL |

## Canonical Baseline Consistency

| Dimension | Expected | Observed | Result |
|---|---|---|---|
| Architecture | Modular Monolith First | Locked in ADR-001/STACK_LOCK | PASS |
| Backend | Express.js + TypeScript; no NestJS | Locked in ADR-002 | PASS |
| Frontend | Next.js + TypeScript | Locked in STACK_LOCK | PASS |
| DB/ORM | PostgreSQL + Prisma | Locked in ADR-003 | PASS |
| Modules | M01–M18 | Present in MODULE_BOUNDARIES/TRACEABILITY | PASS |
| FR | 81; 65/11/5 | Declared reconciled in TRACEABILITY | PASS |
| API | 91 | Declared reconciled in TRACEABILITY | PASS |
| UI | 36 | Declared reconciled in TRACEABILITY | PASS |
| DB manifest | 48 CORE, 12 OPTIONAL, 17 DEFERRED | Declared reconciled in DB audit | PASS |
| Invariants | 57 | Declared reconciled in P0-009/P0-010 | PASS |
| Search/AI | Optional after Phase 13 | ADR-011/Open Decisions | PASS |

## Cross-Artifact Consistency Checks

| Check | Expected | Result | Notes |
|---|---|---|---|
| Scope separation | Product/Core/Demo/Deferred not collapsed | PASS | ADR-012 aligns SCOPE_FREEZE. |
| Global account | No tenantId in source account invariant | PASS_WITH_FINDING | Runtime `users.tenant_id` mismatch preserved, not fixed. |
| Outbox/audit distinction | Outbox delivery, audit history | PASS | ADR-006 + error/evidence plan. |
| Worker boundary | Worker not microservice/aggregate owner | PASS | ADR-010 + P0-007. |
| Version pinning | Immutable official versions | PASS | ADR-009 + invariants. |
| Error direction | P0-012 baseline only | PASS | No final code-level error contract overclaimed. |
| Evidence | Planned vs executed separated | PASS | No `EXECUTED_PASS` without evidence in new docs. |
| Open decisions | OD-001..OD-010 not approved | PASS | OPEN_DECISIONS keeps NEEDS_APPROVAL. |

## Runtime Consistency Findings

| Finding ID | Area | Observed | Expected | Severity | Blocks Phase 0? | Resolution |
|---|---|---|---|---|---|---|
| CF-001 | Identity/Tenancy | Runtime `users.tenant_id` exists | Source global account without tenantId | HIGH | NO | Phase 1+ correction plan before extending auth. |
| CF-002 | DB naming | Runtime-only `users`, `tenants`, `user_roles`, `refresh_tokens`, `system_info` | Source manifest canonical names | MEDIUM | NO | Migration/schema reconciliation. |
| CF-003 | Evidence | Migration/test execution not verified | Executed evidence before phase DONE | MEDIUM | NO | Phase evidence reports. |
| CF-004 | Storage | MinIO/S3 runtime evidence absent | Direct upload evidence in Phase 10 | LOW | NO | Phase 10. |
| CF-005 | Open policy | OD-003..OD-007 unresolved | Approval before detailed Phase 12 policy | MEDIUM | NO for Phase 1 | Advisor/Product approval. |

## Forbidden-Scope Check

| Rule | Result |
|---|---|
| No Phase 1 marked IN_PROGRESS | PASS at audit time; final status remains NEEDS_APPROVAL until sign-off. |
| No Phase 0 DONE claim without approval | PASS. |
| No ADR file beyond 12 required | PASS. |
| No ERROR_CONTRACT implementation code | PASS. |
| No runtime code/schema/migration/seed changes by this docs task | PASS. |
| Search/AI not promoted to CORE | PASS. |

## Approval Readiness

| Gate | Result | Notes |
|---|---|---|
| Documentation baseline complete | PASS | All required Phase 0 docs exist. |
| Non-blocking findings recorded | PASS | Runtime mismatch and ODs tracked. |
| Phase 1 handoff actionable | PASS | Foundation-only scope listed. |
| Human sign-off recorded | NEEDS_APPROVAL | Required to mark Phase 0 DONE. |

## Decision

Phase 0 documentation baseline is internally consistent enough for sign-off review. Do not mark Phase 0 DONE or Phase 1 IN_PROGRESS until `PHASE_0_SIGN_OFF.md` approval gate is explicitly accepted by the user/authority.

## Validation Checklist

| Check | Result |
|---|---|
| All required docs present | PASS |
| 12 ADR present | PASS |
| Counts preserved | PASS |
| Runtime mismatches preserved | PASS |
| Open decisions not approved | PASS |
| Phase 1 not started | PASS |
| Sign-off requires approval | PASS |

## Source References

- `AGENTS.md`
- `docs/PROJECT_STATUS.md`
- `docs/BaoCaoKhoaLuan.docx`
- `docs/phase-0/SOURCE_HIERARCHY.md`
- `docs/phase-0/SCOPE_FREEZE.md`
- `docs/phase-0/STACK_LOCK.md`
- `docs/phase-0/MODULE_BOUNDARIES.md`
- `docs/phase-0/MODULE_DEPENDENCIES.md`
- `docs/phase-0/DATABASE_MANIFEST_AUDIT.md`
- `docs/phase-0/BUSINESS_INVARIANTS.md`
- `docs/phase-0/TRACEABILITY_AUDIT.md`
- `docs/phase-0/adr/*.md`
- `docs/phase-0/ERROR_CONTRACT_BASELINE.md`
- `docs/phase-0/EVIDENCE_PLAN.md`
- `docs/phase-0/RISK_REGISTER.md`
- `docs/phase-0/OPEN_DECISIONS.md`
- `docs/phase-0/PHASE_1_HANDOFF.md`

