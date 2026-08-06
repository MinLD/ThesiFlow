CREATE TYPE "OrganizationStatus" AS ENUM ('active', 'disabled', 'deleted');
CREATE TYPE "MembershipStatus" AS ENUM ('invited', 'active', 'inactive');
CREATE TYPE "MembershipSource" AS ENUM ('invitation', 'import', 'provisioning');
CREATE TYPE "MembershipInvitationStatus" AS ENUM ('pending', 'accepted', 'revoked', 'expired');

ALTER TABLE "roles" DROP CONSTRAINT IF EXISTS "roles_tenant_id_fkey";
ALTER TABLE "audit_logs" DROP CONSTRAINT IF EXISTS "audit_logs_tenant_id_fkey";

ALTER TABLE "tenants" RENAME TO "organizations";
ALTER TABLE "organizations" RENAME CONSTRAINT "tenants_pkey" TO "organizations_pkey";
ALTER INDEX IF EXISTS "tenants_name_key" RENAME TO "organizations_name_key";
ALTER INDEX IF EXISTS "tenants_slug_key" RENAME TO "organizations_slug_key";
ALTER INDEX IF EXISTS "tenants_status_idx" RENAME TO "organizations_status_idx";
ALTER INDEX IF EXISTS "tenants_deleted_at_idx" RENAME TO "organizations_deleted_at_idx";

ALTER TABLE "organizations" ADD COLUMN "verified_at" TIMESTAMP(3);
UPDATE "organizations" SET "verified_at" = "created_at" WHERE "status" = 'active';
ALTER TABLE "organizations" DROP COLUMN IF EXISTS "plan";
ALTER TABLE "organizations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "organizations" ALTER COLUMN "status" TYPE "OrganizationStatus" USING ("status"::text::"OrganizationStatus");
ALTER TABLE "organizations" ALTER COLUMN "status" SET DEFAULT 'active';

ALTER TABLE "roles" RENAME COLUMN "tenant_id" TO "organization_id";
DROP INDEX IF EXISTS "roles_tenant_id_key_scope_key";
CREATE UNIQUE INDEX "roles_organization_id_key_scope_key" ON "roles"("organization_id", "key", "scope");
ALTER TABLE "roles" ADD CONSTRAINT "roles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "audit_logs" RENAME COLUMN "tenant_id" TO "organization_id";
DROP INDEX IF EXISTS "audit_logs_tenant_id_action_idx";
CREATE INDEX "audit_logs_organization_id_action_idx" ON "audit_logs"("organization_id", "action");
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "tenant_memberships" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "account_id" TEXT NOT NULL,
  "status" "MembershipStatus" NOT NULL DEFAULT 'invited',
  "source" "MembershipSource" NOT NULL,
  "activated_at" TIMESTAMP(3),
  "deactivated_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "tenant_memberships_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "membership_invitations" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "status" "MembershipInvitationStatus" NOT NULL DEFAULT 'pending',
  "invited_by_account_id" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "accepted_at" TIMESTAMP(3),
  "revoked_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "membership_invitations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tenant_memberships_organization_id_account_id_key" ON "tenant_memberships"("organization_id", "account_id");
CREATE INDEX "tenant_memberships_account_id_status_idx" ON "tenant_memberships"("account_id", "status");
CREATE INDEX "tenant_memberships_organization_id_status_idx" ON "tenant_memberships"("organization_id", "status");

CREATE UNIQUE INDEX "membership_invitations_token_hash_key" ON "membership_invitations"("token_hash");
CREATE UNIQUE INDEX "membership_invitations_pending_org_email_key" ON "membership_invitations"("organization_id", "email") WHERE "status" = 'pending';
CREATE INDEX "membership_invitations_organization_id_status_idx" ON "membership_invitations"("organization_id", "status");
CREATE INDEX "membership_invitations_email_status_idx" ON "membership_invitations"("email", "status");
CREATE INDEX "membership_invitations_expires_at_idx" ON "membership_invitations"("expires_at");

ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "membership_invitations" ADD CONSTRAINT "membership_invitations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "membership_invitations" ADD CONSTRAINT "membership_invitations_invited_by_account_id_fkey" FOREIGN KEY ("invited_by_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

DROP TYPE IF EXISTS "TenantPlan";
DROP TYPE IF EXISTS "TenantStatus";
