# Phase 3 Code — Organization/Tenant Onboarding

## Session Rule

Đọc theo thứ tự: `docs/BaoCaoKhoaLuan.docx`, `docs/ROADMAP.md`, file PLAN current phase, file CODE current phase, repository hiện tại. Code trong Markdown là `DRAFT_NOT_APPLIED` cho đến khi runtime implementation được duyệt rõ hoặc implementation mode được user yêu cầu.

## Current Progress

- Current Batch: P3-001-B
- Last Completed Batch: P3-001-A — Organization/membership database reconciliation
- Runtime Applied: YES for P3-001-A
- Test Executed: YES — P3-001-A target/full checks pass
- Next Exact Action: Review P3-001-B runtime/domain reconciliation needs; do not start P3-002.
- Latest Runtime Change: P3-001-A database reconciliation applied; no P3 API/frontend implementation started.

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
