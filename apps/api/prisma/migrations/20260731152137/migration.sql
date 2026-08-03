/*
  Warnings:

  - The `status` column on the `system_info` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SystemInfoStatus" AS ENUM ('active', 'disabled');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('pending_verification', 'active', 'disabled');

-- CreateEnum
CREATE TYPE "AccountCredentialType" AS ENUM ('password', 'oauth');

-- CreateEnum
CREATE TYPE "AccountTokenPurpose" AS ENUM ('email_verification', 'password_reset');

-- CreateEnum
CREATE TYPE "AccountTokenStatus" AS ENUM ('active', 'consumed', 'revoked', 'expired');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('active', 'revoked', 'expired');

-- AlterTable
ALTER TABLE "system_info" DROP COLUMN "status",
ADD COLUMN     "status" "SystemInfoStatus" NOT NULL DEFAULT 'active';

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'pending_verification',
    "email_verified_at" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_credentials" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "type" "AccountCredentialType" NOT NULL DEFAULT 'password',
    "password_hash" TEXT NOT NULL,
    "password_updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_tokens" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "purpose" "AccountTokenPurpose" NOT NULL,
    "status" "AccountTokenStatus" NOT NULL DEFAULT 'active',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consumed_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'active',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "rotated_from_session_id" TEXT,
    "reused_at" TIMESTAMP(3),
    "user_agent" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE INDEX "accounts_status_idx" ON "accounts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "account_credentials_account_id_type_key" ON "account_credentials"("account_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "account_tokens_token_hash_key" ON "account_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "account_tokens_account_id_purpose_status_idx" ON "account_tokens"("account_id", "purpose", "status");

-- CreateIndex
CREATE INDEX "account_tokens_status_idx" ON "account_tokens"("status");

-- CreateIndex
CREATE INDEX "account_tokens_expires_at_idx" ON "account_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refresh_token_hash_key" ON "sessions"("refresh_token_hash");

-- CreateIndex
CREATE INDEX "sessions_account_id_status_idx" ON "sessions"("account_id", "status");

-- CreateIndex
CREATE INDEX "sessions_refresh_token_hash_status_idx" ON "sessions"("refresh_token_hash", "status");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "system_info_status_idx" ON "system_info"("status");

-- AddForeignKey
ALTER TABLE "account_credentials" ADD CONSTRAINT "account_credentials_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_tokens" ADD CONSTRAINT "account_tokens_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_rotated_from_session_id_fkey" FOREIGN KEY ("rotated_from_session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
