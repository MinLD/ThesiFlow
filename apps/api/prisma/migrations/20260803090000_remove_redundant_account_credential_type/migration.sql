-- Phase 2 cleanup: password is the only supported credential; no type discriminator needed.
DROP INDEX IF EXISTS "account_credentials_account_id_type_key";
ALTER TABLE "account_credentials" DROP COLUMN IF EXISTS "type";
CREATE UNIQUE INDEX "account_credentials_account_id_key" ON "account_credentials"("account_id");
DROP TYPE IF EXISTS "AccountCredentialType";
