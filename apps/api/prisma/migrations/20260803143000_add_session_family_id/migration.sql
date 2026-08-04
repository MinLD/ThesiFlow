ALTER TABLE "sessions" ADD COLUMN "family_id" TEXT;
UPDATE "sessions" SET "family_id" = "id" WHERE "family_id" IS NULL;
ALTER TABLE "sessions" ALTER COLUMN "family_id" SET NOT NULL;
CREATE INDEX "sessions_family_id_status_idx" ON "sessions"("family_id", "status");
