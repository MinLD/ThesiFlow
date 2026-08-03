-- Drop legacy tenant-bound identity tables. Phase 2 uses global accounts/sessions.
ALTER TABLE "audit_logs" DROP CONSTRAINT IF EXISTS "audit_logs_user_id_fkey";
DROP INDEX IF EXISTS "audit_logs_user_id_created_at_idx";
ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "user_id";

DROP TABLE IF EXISTS "refresh_tokens";
DROP TABLE IF EXISTS "user_roles";
DROP TABLE IF EXISTS "users";

DROP TYPE IF EXISTS "RefreshTokenStatus";
DROP TYPE IF EXISTS "UserStatus";
