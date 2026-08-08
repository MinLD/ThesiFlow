# Phase 3 Code — Organization/Tenant Onboarding

## Session Rule

Đọc theo thứ tự: `docs/BaoCaoKhoaLuan.docx`, `docs/ROADMAP.md`, file PLAN current phase, file CODE current phase, repository hiện tại. Code trong Markdown là `DRAFT_NOT_APPLIED` cho đến khi runtime implementation được duyệt rõ hoặc implementation mode được user yêu cầu.

## Current Progress

- Current Batch: P3-005
- Last Completed Batch: P3-004 — Tenant context switch APIs/tests
- Runtime Applied: YES for P3-005 implementation
- Test Executed: YES — automated checks pass; manual browser verification pending
- Latest Report: `docs/training/reports/2026-08-08_P3-005_REPORT.md`
- Next Exact Action: Run manual browser flows A-G for P3-005; if PASS, close Phase 3 and open Phase 4 tracking. Do not implement Phase 4.
- Latest Runtime Change: P3-005 minimal organization UI plus supporting `GET /api/v1/me/memberships` API implemented.

## Phase 3 Foundation Hardening — before P3-004

### Status

APPLIED

### Runtime Applied

YES

### Target Files

- `docker-compose.yml`
- `.env.example`
- `apps/worker/src/index.ts`
- `apps/worker/tests/outbox-worker.test.ts`
- `apps/worker/package.json`
- `apps/worker/vitest.config.ts`
- `apps/worker/vitest.setup.ts`
- `package.json`
- `apps/api/package.json`
- `package-lock.json`
- `README.md`
- `apps/api/src/config/env.ts`
- `apps/api/tests/env.test.ts`

### Code

Runtime hardening applied. API and worker Docker services now receive the same fail-fast SMTP config from `.env`; API/worker share outbox lock timeout config. Worker claim query keeps `FOR UPDATE SKIP LOCKED` and reclaims stale `processing` events when `locked_at` is older than `OUTBOX_LOCK_TIMEOUT_MS`. Publishing/failure updates clear `locked_at`; failures retain `last_error` and set retry `available_at`.

Worker integration tests cover claim limit, pending success, failed retry gating by `available_at`, active processing lock exclusion, stale processing lock reclaim, handler failure retry metadata, and concurrent workers not processing the same event.

API contract check: source-of-truth routes are `/api/v1/...`; current P3-002/P3-003 unversioned routes are legacy drift. P3-004 must implement canonical `POST /api/v1/tenant-context/switch` without creating a third convention.

Verification: `npm install` PASS; `npm run db:validate` PASS; `npm run prisma:generate --workspace apps/api` PASS; `npm run test --workspace apps/worker` PASS 1 file / 7 tests; worker typecheck/lint/build PASS; root `npm run typecheck` PASS; root `npm run lint` PASS; `DATABASE_URL=... npm test` PASS 19 files / 57 tests; root `npm run build` PASS after sandbox retry; `docker compose config` PASS.

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

## P3-004 — Tenant context switch APIs/tests

### Status

APPLIED

### Runtime Applied

YES

### Target Files

- `apps/api/src/app.ts`
- `apps/api/src/common/auth/requireActiveAccount.ts`
- `apps/api/src/modules/tenant-context/tenant-context.routes.ts`
- `apps/api/src/modules/tenant-context/tenant-context.controller.ts`
- `apps/api/src/modules/tenant-context/tenant-context.service.ts`
- `apps/api/src/modules/tenant-context/tenant-context.repository.ts`
- `apps/api/src/modules/tenant-context/tenant-context.schemas.ts`
- `apps/api/src/modules/tenant-context/tenant-context.mapper.ts`
- `apps/api/src/modules/organizations/organization.service.ts`
- `apps/api/tests/tenancy/tenant-context-switch.test.ts`
- `apps/api/tests/tenancy/runtime-reconciliation-boundary.test.ts`

### Code

Runtime status: applied. Canonical endpoint `POST /api/v1/tenant-context/switch` accepts `{ "organizationId": "uuid" }`. It requires bearer auth, verifies the account is active, and resolves tenant context from current DB state: `TenantMembership.accountId`, `TenantMembership.organizationId`, `TenantMembership.status = active`, `Organization.status = active`, `Organization.deletedAt = null`.

Response DTO returns only server-resolved context: `accountId`, `organizationId`, `membershipId`, minimal `organization` `{ id, name, slug }`, and minimal `membership` `{ id, status, source }`. It does not issue a new access token/session and does not persist tenant context. P3 schema has no membership role field yet; role assignment remains Phase 4 scope, and forged request `role` is ignored by validation/DTO boundary.

Verification: target P3-004 tests PASS 2 files / 11 tests; `npm run db:validate` PASS; `npm run prisma:generate --workspace apps/api` PASS; `npm run typecheck` PASS; `npm run lint` PASS; full API `DATABASE_URL=... npm test` PASS 20 files / 66 tests; `npm run test --workspace apps/worker` PASS 1 file / 7 tests; explicit API workspace test PASS 20 files / 66 tests; `npm run build` PASS.

## P3-005 — Minimal organization UI

### Status

APPLIED_AUTOMATED_VERIFIED_MANUAL_PENDING

### Runtime Applied

YES

### Target Files

- `apps/api/src/app.ts`
- `apps/api/src/modules/me/me.routes.ts`
- `apps/api/src/modules/me/me.controller.ts`
- `apps/api/src/modules/me/me.service.ts`
- `apps/api/src/modules/me/me.repository.ts`
- `apps/api/src/modules/me/me.mapper.ts`
- `apps/api/tests/tenancy/tenant-context-switch.test.ts`
- `apps/web/src/app/providers.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/invitations/accept/page.tsx`
- `apps/web/src/features/auth/AuthPanel.tsx`
- `apps/web/src/features/tenancy/TenantProvider.tsx`
- `apps/web/src/features/tenancy/TenantDashboard.tsx`
- `apps/web/src/features/tenancy/tenancy.api.ts`
- `apps/web/src/features/tenancy/types.ts`
- `apps/web/src/features/tenancy/TenantDashboard.test.tsx`
- `apps/web/src/features/tenancy/tenancy.api.test.ts`
- `apps/web/vitest.config.ts`
- `apps/web/package.json`

### Code

Runtime status: applied. Frontend now wraps authenticated UI with `TenantProvider`, loads memberships through supporting canonical read endpoint `GET /api/v1/me/memberships`, and activates tenant context only from server response of `POST /api/v1/tenant-context/switch`.

Tenant context remains separate from auth identity. Reload/session restore does not trust local tenant state; logout clears active tenant context and tenant-owned React Query cache keys. Tenant-owned query keys include tenant/account scope where used.

UI includes minimal tenant selector, current organization indicator, organization workspace, organization create form using legacy runtime `POST /organizations`, activate action using legacy runtime `POST /organizations/:id/activate`, invitation form using legacy runtime `POST /organizations/:id/invitations`, and invitation accept page using legacy runtime `POST /membership-invitations/accept`. No Phase 4 RBAC or fake permissions were added.

Supporting API `GET /api/v1/me/memberships` is read-only, authenticated, scoped to the current account, and returns only minimal membership + organization DTOs with `canSwitch` resolved server-side. It does not accept arbitrary `accountId`.

Verification: `npm install` PASS; `npm run typecheck` PASS; `npm run lint` PASS; `DATABASE_URL=... npm test` PASS 20 files / 67 tests after sandbox retry; `npm test --workspace apps/web` PASS 2 files / 13 tests; `npm test --workspace apps/worker` PASS 1 file / 7 tests; `npm run db:validate` PASS; `npm run prisma:generate --workspace apps/api` PASS; `npm run build` PASS; `git diff --check` PASS. Manual browser flows A-G NOT RUN in current CLI environment.
