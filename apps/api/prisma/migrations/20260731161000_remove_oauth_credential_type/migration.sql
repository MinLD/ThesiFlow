-- Phase 2 scope cleanup: account credentials are password-only; OAuth/SSO is forbidden scope.
ALTER TYPE "AccountCredentialType" RENAME TO "AccountCredentialType_old";
CREATE TYPE "AccountCredentialType" AS ENUM ('password');
ALTER TABLE "account_credentials" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "account_credentials"
  ALTER COLUMN "type" TYPE "AccountCredentialType"
  USING ("type"::text::"AccountCredentialType");
ALTER TABLE "account_credentials" ALTER COLUMN "type" SET DEFAULT 'password';
DROP TYPE "AccountCredentialType_old";
