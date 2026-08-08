# Phase 3 Code — Organization/Tenant Onboarding

## Session Rule

Đọc theo thứ tự: `docs/BaoCaoKhoaLuan.docx`, `docs/ROADMAP.md`, file PLAN current phase, file CODE current phase, repository hiện tại. Code trong Markdown là `DRAFT_NOT_APPLIED` cho đến khi runtime implementation được duyệt rõ hoặc implementation mode được user yêu cầu.

## Current Progress

- Current Batch: P3-004
- Last Completed Batch: P3-003 — Membership invitation/accept lifecycle
- Runtime Applied: YES for P3-003
- Test Executed: YES — P3-003 review target/P3/full checks pass
- Latest Review: `docs/training/reviews/2026-08-08_P3-003_REVIEW.md` — PASS_WITH_MINOR_NOTES
- Next Exact Action: Create/read P3-004 task and implement tenant context switch APIs/tests; do not start P3-005.
- Latest Runtime Change: P3-003 invitation create/accept lifecycle implemented.

## P3-001 — Organization/membership model reconciliation

### Status

APPLIED

### Runtime Applied

YES

### Target Files

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/<timestamp>_phase_03_organization_membership_reconciliation/migration.sql`
- `apps/api/prisma/seed.ts` if seed references legacy `Tenant`

### Code

Canonical database draft: `docs/training/database-specs/2026-08-06_P3-001-A_DATABASE.md`.

AI-created contract test: `apps/api/tests/tenancy/organization-membership-reconciliation.test.ts`.

Runtime status: applied in P3-001-A.

Applied runtime files:

- `apps/api/prisma/schema.prisma` — replaced legacy `Tenant` runtime model with `Organization`, `TenantMembership`, `MembershipInvitation`; `Role` and `AuditLog` now reference `organizationId`.
- `apps/api/prisma/migrations/20260806090000_phase_03_organization_membership_reconciliation/migration.sql` — renames `tenants` to `organizations`, creates membership/invitation tables, indexes and FK constraints.
- `apps/api/prisma/seed.ts` — seeds demo organization and organization-scoped roles.
- `apps/api/src/generated/prisma/` — regenerated from reconciled schema.

Verification: `npm run db:validate`; target tenancy test PASS 1 file / 4 tests; root `npm run lint`; root `npm run typecheck`; full API `npm run test` PASS 16 files / 46 tests; root `npm run build` PASS.

## P3-001-B — Runtime/domain reconciliation assessment

### Status

REVIEWED

### Runtime Applied

NO

### Target Files

- `apps/api/tests/tenancy/runtime-reconciliation-boundary.test.ts`
- `docs/training/tasks/2026-08-06_P3-001-B.md`

### Code

Boundary test verifies checked runtime source/seed do not use legacy tenant access and Phase 3 routes stay within current create/activate/invitation scope.

Verification: `npm run test --workspace apps/api -- tenancy/runtime-reconciliation-boundary.test.ts` PASS 1 file / 2 tests; `npm run lint --workspace apps/api` PASS.

## P3-002 — Organization create/activate APIs

### Status

APPLIED

### Runtime Applied

YES

### Target Files

- `apps/api/src/modules/organizations/organization.routes.ts`
- `apps/api/src/modules/organizations/organization.controller.ts`
- `apps/api/src/modules/organizations/organization.service.ts`
- `apps/api/src/modules/organizations/organization.repository.ts`
- `apps/api/src/modules/organizations/organization.schemas.ts`
- `apps/api/src/modules/organizations/organization.mapper.ts`
- `apps/api/src/app.ts`

### Code

AI-created API contract test: `apps/api/tests/tenancy/organization-create-activate.test.ts`.

Daily task: `docs/training/tasks/2026-08-06_P3-002.md`.

Runtime status: applied.

Applied runtime files:

- `apps/api/src/modules/organizations/organization.routes.ts` — mounts create and activate endpoints only.
- `apps/api/src/modules/organizations/organization.controller.ts` — thin handlers.
- `apps/api/src/modules/organizations/organization.service.ts` — bearer auth, state transition, domain errors.
- `apps/api/src/modules/organizations/organization.repository.ts` — transaction boundary for create+membership and activate+membership.
- `apps/api/src/modules/organizations/organization.schemas.ts` — Zod create/params validation.
- `apps/api/src/modules/organizations/organization.mapper.ts` — safe organization/membership DTOs.
- `apps/api/src/app.ts` — mounts `/organizations`.

Verification: target P3 tenancy tests PASS 3 files / 10 tests; `npm run db:validate` PASS; root `npm run lint`; root `npm run typecheck`; full API `npm run test` PASS 18 files / 52 tests; root `npm run build` PASS.

## P3-003 — Membership invitation/accept lifecycle

### Status

APPLIED

### Runtime Applied

YES

### Target Files

- `apps/api/src/modules/organizations/*`
- optionally `apps/api/src/modules/membership-invitations/*`
- optionally shared auth guard under `apps/api/src/common/*`
- `apps/api/src/app.ts`

### Code

AI-created API contract test: `apps/api/tests/tenancy/membership-invitation-lifecycle.test.ts`.

Daily task: `docs/training/tasks/2026-08-06_P3-003.md`.

Database spec: `docs/training/database-specs/2026-08-06_P3-003_DATABASE.md`.

Runtime status: applied.

Applied runtime changes:

- `POST /organizations/:organizationId/invitations` creates pending invitations for active organization members.
- `POST /membership-invitations/accept` accepts pending invitation for matching active account email.
- Raw invitation token is generated and returned only as delivery material; DB stores only `tokenHash`.
- Accept transaction marks invitation accepted and creates active `TenantMembership` source `invitation`.
- DTOs hide `tokenHash`; boundary test updated for P3-003 route scope.

Verification: P3 tenancy tests PASS 4 files / 14 tests; `npm run db:validate` PASS; root `npm run lint`; root `npm run typecheck`; full API `npm run test` PASS 19 files / 56 tests; root `npm run build` PASS.

Review: `docs/training/reviews/2026-08-08_P3-003_REVIEW.md` — PASS_WITH_MINOR_NOTES; no P0/P1; P2 atomic pending guard deferred.
