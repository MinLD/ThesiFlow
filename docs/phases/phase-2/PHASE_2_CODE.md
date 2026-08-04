# Phase 2 Code — Global Account Authentication

## Session Rule

Đọc theo thứ tự: `docs/BaoCaoKhoaLuan.docx`, `docs/ROADMAP.md`, file PLAN current phase, file CODE current phase, repository hiện tại. Code trong Markdown là `DRAFT_NOT_APPLIED` cho đến khi runtime implementation được duyệt rõ.

## Current Progress

- Current Batch: Phase 3 / P3-001
- Last Completed Batch: P2-HOTFIX — Hybrid auth security refactor
- Runtime Applied: YES for P2-001/P2-006 and P2-HOTFIX
- Test Executed: YES — db validate, API/web typecheck, API/web lint, API/web build, full API test PASS 15 files / 42 tests
- Scope Cleanup: `account_credentials` has no credential type discriminator; OAuth/SSO remains forbidden scope
- Next Exact Action: Read `docs/phases/phase-3/PHASE_3_PLAN.md`, then implement P3-001 organization/membership model reconciliation; do not start Phase 4.

## P2-001 — Authentication/account model reconciliation

### Status

CODE_DRAFT_DONE

### Mục tiêu

Chuẩn hóa Identity Phase 2 thành account toàn cục, tách khỏi `tenantId`, chuẩn bị cho session/token an toàn. Scaffold cũ `User`, `Tenant`, `RefreshToken`, `Role`, `UserRole` không được dùng làm identity chuẩn Phase 2 vì đang gắn tenant quá sớm.

### Runtime Applied

YES — implemented in runtime by current Phase 2 work.

### Dependency

- Dùng dependency đã có: `@prisma/client`, `@prisma/adapter-pg`, `argon2`, `jsonwebtoken`, `zod`.
- Không thêm package.

### Target Files

- `apps/api/prisma/schema.prisma` — sửa, thêm model Phase 2 chuẩn.
- `apps/api/prisma/migrations/20260731152137/migration.sql` — tạo mới bởi Prisma migrate.
- `apps/api/prisma/migrations/20260731161000_remove_oauth_credential_type/migration.sql` — tạo mới, loại `oauth` out-of-scope.
- `apps/api/prisma/migrations/20260803090000_remove_redundant_account_credential_type/migration.sql` — tạo mới, bỏ discriminator `type` thừa.
- `apps/api/src/modules/auth/auth.repository.ts` — sửa, chuyển repository sang `Account`.
- `apps/api/src/common/auth/token.ts` — sửa, bỏ `tenantId` khỏi access token payload.

### Code

```prisma
// Task ID: P2-001
// Target: apps/api/prisma/schema.prisma
// Operation: MODIFY
// Status: IMPLEMENTED
// Runtime Applied: YES
// Copy note: final Phase 2 identity/session schema.

enum AccountStatus {
  pending_verification
  active
  disabled
}

enum AccountTokenPurpose {
  email_verification
  password_reset
}

enum AccountTokenStatus {
  active
  consumed
  revoked
  expired
}

enum SessionStatus {
  active
  revoked
  expired
}

model Account {
  id              String        @id @default(uuid())
  email           String        @unique
  fullName        String        @map("full_name")
  status          AccountStatus @default(pending_verification)
  emailVerifiedAt DateTime?     @map("email_verified_at")
  lastLoginAt     DateTime?     @map("last_login_at")
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  credentials AccountCredential[]
  tokens      AccountToken[]
  sessions    Session[]

  @@index([status])
  @@map("accounts")
}

model AccountCredential {
  id                String                @id @default(uuid())
  accountId         String                @map("account_id")
  passwordHash      String                @map("password_hash")
  passwordUpdatedAt DateTime?             @map("password_updated_at")
  createdAt         DateTime              @default(now()) @map("created_at")
  updatedAt         DateTime              @updatedAt @map("updated_at")
  account           Account               @relation(fields: [accountId], references: [id], onDelete: Cascade)

  @@unique([accountId])
  @@map("account_credentials")
}

model AccountToken {
  id         String              @id @default(uuid())
  accountId  String              @map("account_id")
  tokenHash  String              @unique @map("token_hash")
  purpose    AccountTokenPurpose
  status     AccountTokenStatus  @default(active)
  expiresAt  DateTime            @map("expires_at")
  consumedAt DateTime?           @map("consumed_at")
  revokedAt  DateTime?           @map("revoked_at")
  createdAt  DateTime            @default(now()) @map("created_at")

  account Account @relation(fields: [accountId], references: [id], onDelete: Cascade)

  @@index([accountId, purpose, status])
  @@index([status])
  @@index([expiresAt])
  @@map("account_tokens")
}

model Session {
  id                   String        @id @default(uuid())
  accountId            String        @map("account_id")
  refreshTokenHash     String        @unique @map("refresh_token_hash")
  status               SessionStatus @default(active)
  expiresAt            DateTime      @map("expires_at")
  revokedAt            DateTime?     @map("revoked_at")
  rotatedFromSessionId String?       @map("rotated_from_session_id")
  reusedAt             DateTime?     @map("reused_at")
  userAgent            String?       @map("user_agent")
  ipAddress            String?       @map("ip_address")
  createdAt            DateTime      @default(now()) @map("created_at")
  updatedAt            DateTime      @updatedAt @map("updated_at")

  account     Account   @relation(fields: [accountId], references: [id], onDelete: Cascade)
  rotatedFrom Session?  @relation("SessionRotation", fields: [rotatedFromSessionId], references: [id])
  rotatedTo   Session[] @relation("SessionRotation")

  @@index([accountId, status])
  @@index([refreshTokenHash, status])
  @@index([expiresAt])
  @@map("sessions")
}
```

```sql
-- Task ID: P2-001
-- Target: apps/api/prisma/migrations/20260731090000_phase_02_global_identity/migration.sql
-- Operation: CREATE
-- Status: DRAFT_NOT_APPLIED
-- Runtime Applied: NO

CREATE TYPE "AccountStatus" AS ENUM ('pending_verification', 'active', 'disabled');
CREATE TYPE "AccountTokenPurpose" AS ENUM ('email_verification', 'password_reset');
CREATE TYPE "AccountTokenStatus" AS ENUM ('active', 'consumed', 'revoked', 'expired');
CREATE TYPE "SessionStatus" AS ENUM ('active', 'revoked', 'expired');

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

CREATE TABLE "account_credentials" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "password_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_credentials_pkey" PRIMARY KEY ("id")
);

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

CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");
CREATE INDEX "accounts_status_idx" ON "accounts"("status");
CREATE UNIQUE INDEX "account_credentials_account_id_key" ON "account_credentials"("account_id");
CREATE UNIQUE INDEX "account_tokens_token_hash_key" ON "account_tokens"("token_hash");
CREATE INDEX "account_tokens_account_id_purpose_status_idx" ON "account_tokens"("account_id", "purpose", "status");
CREATE INDEX "account_tokens_token_hash_status_idx" ON "account_tokens"("token_hash", "status");
CREATE INDEX "account_tokens_expires_at_idx" ON "account_tokens"("expires_at");
CREATE UNIQUE INDEX "sessions_refresh_token_hash_key" ON "sessions"("refresh_token_hash");
CREATE INDEX "sessions_account_id_status_idx" ON "sessions"("account_id", "status");
CREATE INDEX "sessions_refresh_token_hash_status_idx" ON "sessions"("refresh_token_hash", "status");
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

ALTER TABLE "account_credentials" ADD CONSTRAINT "account_credentials_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account_tokens" ADD CONSTRAINT "account_tokens_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_rotated_from_session_id_fkey" FOREIGN KEY ("rotated_from_session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

```typescript
// Task ID: P2-001
// Target: apps/api/src/modules/auth/auth.repository.ts
// Operation: MODIFY
// Status: DRAFT_NOT_APPLIED
// Runtime Applied: NO

import type { AccountStatus, Prisma } from "../../generated/prisma/client";
import { prisma } from "../../database/prisma";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function findAccountByEmail(email: string) {
  return prisma.account.findUnique({
    where: { email: normalizeEmail(email) },
    include: { credentials: true },
  });
}

function findAccountById(id: string) {
  return prisma.account.findUnique({
    where: { id },
    include: { credentials: true },
  });
}

function createAccountWithPassword(input: {
  email: string;
  fullName: string;
  passwordHash: string;
  status?: AccountStatus;
}) {
  return prisma.account.create({
    data: {
      email: normalizeEmail(input.email),
      fullName: input.fullName.trim(),
      status: input.status ?? "pending_verification",
      credentials: {
        create: {
          passwordHash: input.passwordHash,
        },
      },
    },
    include: { credentials: true },
  });
}

function updateLastLoginAt(accountId: string, now = new Date()) {
  return prisma.account.update({
    where: { id: accountId },
    data: { lastLoginAt: now },
  });
}

function markEmailVerified(accountId: string, now = new Date()) {
  return prisma.account.update({
    where: { id: accountId },
    data: { status: "active", emailVerifiedAt: now },
  });
}

function runAuthTransaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) {
  return prisma.$transaction(callback);
}

export {
  createAccountWithPassword,
  findAccountByEmail,
  findAccountById,
  markEmailVerified,
  normalizeEmail,
  runAuthTransaction,
  updateLastLoginAt,
};
```

```typescript
// Task ID: P2-001
// Target: apps/api/src/common/auth/token.ts
// Operation: MODIFY
// Status: DRAFT_NOT_APPLIED
// Runtime Applied: NO

import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

type AccessTokenPayload = {
  sub: string;
  sessionId: string;
  email: string;
};

function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL_SECONDS,
  });
}

function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
}

function createOpaqueRefreshToken(): string {
  return crypto.randomBytes(48).toString("base64url");
}

function hashRefreshToken(token: string): string {
  return crypto
    .createHmac("sha256", env.REFRESH_TOKEN_SECRET)
    .update(token)
    .digest("hex");
}

function getRefreshTokenExpiresAt(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.REFRESH_TOKEN_TTL_DAYS);
  return expiresAt;
}

export {
  signAccessToken,
  verifyAccessToken,
  createOpaqueRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiresAt,
};
```

### Test Code

```typescript
// Task ID: P2-001
// Target: apps/api/tests/auth/account-model.contract.test.ts
// Operation: CREATE
// Status: DRAFT_NOT_APPLIED
// Runtime Applied: NO

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const schema = readFileSync(join(process.cwd(), "prisma/schema.prisma"), "utf8");

describe("Phase 2 account model contract", () => {
  it("keeps Account global and tenant-free", () => {
    const accountModel = schema.match(/model Account \{[\s\S]*?\n\}/)?.[0] ?? "";

    expect(accountModel).toContain('@@map("accounts")');
    expect(accountModel).toContain("email           String        @unique");
    expect(accountModel).not.toContain("tenantId");
    expect(accountModel).not.toContain("tenant_id");
  });

  it("stores one-way token hashes only", () => {
    const accountTokenModel = schema.match(/model AccountToken \{[\s\S]*?\n\}/)?.[0] ?? "";
    const sessionModel = schema.match(/model Session \{[\s\S]*?\n\}/)?.[0] ?? "";

    expect(accountTokenModel).toContain("tokenHash  String              @unique");
    expect(sessionModel).toContain("refreshTokenHash     String        @unique");
    expect(accountTokenModel).not.toContain(" token ");
    expect(sessionModel).not.toContain(" refreshToken ");
  });
});
```

### Validation cần chạy sau khi áp dụng

```bash
npm run db:validate
npm run typecheck --workspace apps/api
npm run test --workspace apps/api -- auth/account-model.contract.test.ts
```

### Kết quả hiện tại

- Code Draft: DONE
- Runtime Applied: YES
- Test Executed: YES — Prisma validate and API typecheck pass after client generation.
- Next Action: P2-002 completed; continue P2-003.

### Ghi chú reconciliation

- `User.tenantId`, `RefreshToken.tenantId`, `UserRole` là scaffold cũ/out-of-phase so với Phase 2 và đã bị xóa khỏi runtime ngày 2026-08-03.
- `Tenant`, `Role`, `Permission`, `RolePermission` được giữ tạm cho Phase 3/4 reconciliation; không còn là identity/auth source.
- Seed đã chuyển admin sang global `Account` + `AccountCredential`; không tạo `User` hoặc `UserRole` nữa.

### Runtime cleanup 2026-08-03

- Removed from Prisma schema: `UserStatus`, `RefreshTokenStatus`, `User`, `UserRole`, `RefreshToken`, `AuditLog.userId`; renamed `AuditAction.USER_CREATED` to `ACCOUNT_CREATED`.
- Added migrations: `apps/api/prisma/migrations/20260803093000_remove_legacy_user_identity/migration.sql`; `apps/api/prisma/migrations/20260803094000_rename_user_created_audit_action/migration.sql`.
- Updated seed: admin account uses `account`/`accountCredential`; permission seed uses `account:read` instead of `user:read`.
- Runtime Applied: YES.
- Test Executed: YES — db validate, Prisma generate, API typecheck/lint, DB migrate/seed, auth security test PASS.

## P2-002 — Account credentials/password/token primitives

### Status

VERIFIED

### Mục tiêu

Thêm primitive an toàn cho password, account token hash một chiều, expiry boundary, consume/revoke lifecycle.

### Runtime Applied

YES

### Target Files

- `apps/api/src/common/auth/token.ts` — sửa access token payload bỏ `tenantId`, thêm `sessionId`.
- `apps/api/src/modules/auth/credential.service.ts` — tạo mới.
- `apps/api/src/modules/auth/auth.repository.ts` — sửa, thêm account-token persistence methods.
- `apps/api/src/modules/auth/account-token.service.ts` — tạo mới; không import Prisma trực tiếp.
- `eslint.config.mjs` — sửa, chặn auth service import DB trực tiếp.
- `apps/api/tests/auth/credential-token.service.test.ts` — tạo local test; folder đang bị `.gitignore` bỏ qua theo yêu cầu trước đó.

### Code

```typescript
// Task ID: P2-002
// Target: apps/api/src/common/auth/token.ts
// Operation: MODIFY
// Status: IMPLEMENTED
// Runtime Applied: YES

import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

type AccessTokenPayload = {
  sub: string;
  sessionId: string;
  email: string;
};
function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL_SECONDS,
  });
}

function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
}
function createOpaqueRefreshToken(): string {
  return crypto.randomBytes(48).toString("base64url");
}

function hashRefreshToken(token: string): string {
  return crypto
    .createHmac("sha256", env.REFRESH_TOKEN_SECRET)
    .update(token)
    .digest("hex");
}
function getRefreshTokenExpiresAt(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.REFRESH_TOKEN_TTL_DAYS);
  return expiresAt;
}
export {
  signAccessToken,
  verifyAccessToken,
  createOpaqueRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiresAt,
};
```

```typescript
// Task ID: P2-002
// Target: apps/api/src/modules/auth/credential.service.ts
// Operation: CREATE
// Status: IMPLEMENTED
// Runtime Applied: YES
  
import { AppError } from "../../common/errors/AppError";
import { hashPassword, verifyPassword } from "../../common/auth/password";

const MIN_PASSWORD_LENGTH = 12;

function assertPasswordPolicy(password: string): void {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(400, "WEAK_PASSWORD", "Password must be at least 12 characters");
  }
}

async function hashAccountPassword(password: string): Promise<string> {
  assertPasswordPolicy(password);
  return hashPassword(password);
}

async function verifyAccountPassword(passwordHash: string, password: string): Promise<boolean> {
  if (!passwordHash || !password) {
    return false;
  }

  try {
    return await verifyPassword(passwordHash, password);
  } catch {
    return false;
  }
}

export { assertPasswordPolicy, hashAccountPassword, verifyAccountPassword };
```

```typescript
// Task ID: P2-002
// Target: apps/api/src/modules/auth/auth.repository.ts
// Operation: MODIFY
// Status: IMPLEMENTED
// Runtime Applied: YES

import type {
  AccountTokenPurpose,
  AccountStatus,
  Prisma,
} from "../../generated/prisma/client";
import { prisma } from "../../database/prisma";

type AuthDbClient = typeof prisma | Prisma.TransactionClient;

function getAuthDb(db?: AuthDbClient): AuthDbClient {
  return db ?? prisma;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function findAccountByEmail(email: string) {
  return prisma.account.findUnique({
    where: { email: normalizeEmail(email) },
    include: { credentials: true },
  });
}

function findAccountById(id: string) {
  return prisma.account.findUnique({
    where: { id },
    include: { credentials: true },
  });
}

function createAccountWithPassword(input: {
  email: string;
  fullName: string;
  passwordHash: string;
  status?: AccountStatus;
}) {
  return prisma.account.create({
    data: {
      email: normalizeEmail(input.email),
      fullName: input.fullName.trim(),
      status: input.status ?? "pending_verification",
      credentials: {
        create: {
          passwordHash: input.passwordHash,
        },
      },
    },
    include: { credentials: true },
  });
}

function updateLastLoginAt(accountId: string, now = new Date()) {
  return prisma.account.update({
    where: { id: accountId },
    data: { lastLoginAt: now },
  });
}

function createSession(input: {
  accountId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  rotatedFromSessionId?: string;
  db?: AuthDbClient;
}) {
  return getAuthDb(input.db).session.create({
    data: {
      accountId: input.accountId,
      refreshTokenHash: input.refreshTokenHash,
      expiresAt: input.expiresAt,
      ...(input.userAgent ? { userAgent: input.userAgent } : {}),
      ...(input.ipAddress ? { ipAddress: input.ipAddress } : {}),
      ...(input.rotatedFromSessionId
        ? { rotatedFromSessionId: input.rotatedFromSessionId }
        : {}),
    },
  });
}

function findSessionByRefreshTokenHash(
  refreshTokenHash: string,
  db?: AuthDbClient,
) {
  return getAuthDb(db).session.findUnique({
    where: { refreshTokenHash },
    include: { account: true },
  });
}

function markSessionRevoked(id: string, revokedAt: Date, db?: AuthDbClient) {
  return getAuthDb(db).session.update({
    where: { id },
    data: { status: "revoked", revokedAt },
  });
}

function markSessionExpired(id: string, db?: AuthDbClient) {
  return getAuthDb(db).session.update({
    where: { id },
    data: { status: "expired" },
  });
}

function markSessionReused(id: string, reusedAt: Date, db?: AuthDbClient) {
  return getAuthDb(db).session.update({
    where: { id },
    data: { reusedAt },
  });
}

function revokeActiveSessionsForAccount(
  accountId: string,
  revokedAt: Date,
  db?: AuthDbClient,
) {
  return getAuthDb(db).session.updateMany({
    where: { accountId, status: "active" },
    data: { status: "revoked", revokedAt },
  });
}

function markEmailVerified(
  accountId: string,
  now = new Date(),
  db?: AuthDbClient,
) {
  return getAuthDb(db).account.update({
    where: { id: accountId },
    data: { status: "active", emailVerifiedAt: now },
  });
}

function createStoredAccountToken(input: {
  accountId: string;
  purpose: AccountTokenPurpose;
  tokenHash: string;
  expiresAt: Date;
  db?: AuthDbClient;
}) {
  return getAuthDb(input.db).accountToken.create({
    data: {
      accountId: input.accountId,
      purpose: input.purpose,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
    },
  });
}

function findAccountTokenByHash(tokenHash: string, db?: AuthDbClient) {
  return getAuthDb(db).accountToken.findUnique({
    where: { tokenHash },
  });
}

function markAccountTokenConsumed(
  id: string,
  consumedAt: Date,
  db?: AuthDbClient,
) {
  return getAuthDb(db).accountToken.update({
    where: { id },
    data: { status: "consumed", consumedAt },
  });
}

function markAccountTokenExpired(id: string, db?: AuthDbClient) {
  return getAuthDb(db).accountToken.update({
    where: { id },
    data: { status: "expired" },
  });
}

async function revokeStoredAccountTokens(input: {
  accountId: string;
  purpose: AccountTokenPurpose;
  revokedAt: Date;
  db?: AuthDbClient;
}): Promise<number> {
  const result = await getAuthDb(input.db).accountToken.updateMany({
    where: {
      accountId: input.accountId,
      purpose: input.purpose,
      status: "active",
    },
    data: {
      status: "revoked",
      revokedAt: input.revokedAt,
    },
  });

  return result.count;
}

function runAuthTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  return prisma.$transaction(callback);
}

export {
  type AuthDbClient,
  createAccountWithPassword,
  createSession,
  createStoredAccountToken,
  findAccountByEmail,
  findAccountById,
  findAccountTokenByHash,
  findSessionByRefreshTokenHash,
  markAccountTokenConsumed,
  markAccountTokenExpired,
  markEmailVerified,
  markSessionExpired,
  markSessionReused,
  markSessionRevoked,
  normalizeEmail,
  revokeActiveSessionsForAccount,
  revokeStoredAccountTokens,
  runAuthTransaction,
  updateLastLoginAt,
};
```

```typescript
// Task ID: P2-002
// Target: apps/api/src/modules/auth/account-token.service.ts
// Operation: CREATE
// Status: IMPLEMENTED
// Runtime Applied: YES

import crypto from "node:crypto";
import type { AccountTokenPurpose } from "../../generated/prisma/client";
import { env } from "../../config/env";
import {
  type AuthDbClient,
  createStoredAccountToken,
  findAccountTokenByHash,
  markAccountTokenConsumed,
  markAccountTokenExpired,
  revokeStoredAccountTokens,
} from "./auth.repository";

const DEFAULT_ACCOUNT_TOKEN_TTL_MINUTES = 60;

function createOpaqueAccountToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function hashAccountToken(token: string): string {
  return crypto
    .createHmac("sha256", env.REFRESH_TOKEN_SECRET)
    .update(token)
    .digest("hex");
}

function getAccountTokenExpiresAt(now = new Date(), ttlMinutes = DEFAULT_ACCOUNT_TOKEN_TTL_MINUTES): Date {
  return new Date(now.getTime() + ttlMinutes * 60 * 1000);
}

function isExpired(expiresAt: Date, now = new Date()): boolean {
  return expiresAt.getTime() <= now.getTime();
}

async function createAccountToken(input: {
  accountId: string;
  purpose: AccountTokenPurpose;
  now?: Date;
  ttlMinutes?: number;
  db?: AuthDbClient;
}): Promise<{ token: string; expiresAt: Date }> {
  const token = createOpaqueAccountToken();
  const expiresAt = getAccountTokenExpiresAt(input.now, input.ttlMinutes);

  await createStoredAccountToken({
    accountId: input.accountId,
    purpose: input.purpose,
    tokenHash: hashAccountToken(token),
    expiresAt,
    ...(input.db ? { db: input.db } : {}),
  });

  return { token, expiresAt };
}

async function consumeAccountToken(input: {
  token: string;
  purpose: AccountTokenPurpose;
  now?: Date;
  db?: AuthDbClient;
}): Promise<{ accountId: string } | null> {
  const now = input.now ?? new Date();
  const token = await findAccountTokenByHash(hashAccountToken(input.token), input.db);

  if (!token || token.purpose !== input.purpose || token.status !== "active") {
    return null;
  }

  if (isExpired(token.expiresAt, now)) {
    await markAccountTokenExpired(token.id, input.db);
    return null;
  }

  await markAccountTokenConsumed(token.id, now, input.db);

  return { accountId: token.accountId };
}

async function revokeAccountTokens(input: {
  accountId: string;
  purpose: AccountTokenPurpose;
  now?: Date;
  db?: AuthDbClient;
}): Promise<number> {
  return revokeStoredAccountTokens({
    accountId: input.accountId,
    purpose: input.purpose,
    revokedAt: input.now ?? new Date(),
    ...(input.db ? { db: input.db } : {}),
  });
}

export {
  consumeAccountToken,
  createAccountToken,
  createOpaqueAccountToken,
  getAccountTokenExpiresAt,
  hashAccountToken,
  isExpired,
  revokeAccountTokens,
};
```

### Test Code

```typescript
// Task ID: P2-002
// Target: apps/api/tests/auth/credential-token.service.test.ts
// Operation: CREATE
// Status: IMPLEMENTED_LOCAL_IGNORED
// Runtime Applied: YES locally; Git-tracked: NO because `apps/api/tests/` is ignored.

import { describe, expect, it } from "vitest";
import { AppError } from "../../src/common/errors/AppError";
import {
  assertPasswordPolicy,
  hashAccountPassword,
  verifyAccountPassword,
} from "../../src/modules/auth/credential.service";
import {
  createOpaqueAccountToken,
  getAccountTokenExpiresAt,
  hashAccountToken,
  isExpired,
} from "../../src/modules/auth/account-token.service";

describe("Phase 2 credential primitives", () => {
  it("rejects weak passwords", () => {
    expect(() => assertPasswordPolicy("short")).toThrow(AppError);
  });

  it("hashes and verifies account passwords", async () => {
    const hash = await hashAccountPassword("correct horse battery staple");

    expect(hash).not.toContain("correct horse battery staple");
    expect(await verifyAccountPassword(hash, "correct horse battery staple")).toBe(true);
    expect(await verifyAccountPassword(hash, "wrong password value")).toBe(false);
  });
});

describe("Phase 2 account token primitives", () => {
  it("creates opaque token hashes", () => {
    const token = createOpaqueAccountToken();
    const hash = hashAccountToken(token);

    expect(token).not.toEqual(hash);
    expect(hash).toHaveLength(64);
    expect(hashAccountToken(token)).toEqual(hash);
  });

  it("handles token expiry boundaries", () => {
    const now = new Date("2026-07-31T00:00:00.000Z");
    const expiresAt = getAccountTokenExpiresAt(now, 10);

    expect(isExpired(expiresAt, new Date("2026-07-31T00:09:59.999Z"))).toBe(false);
    expect(isExpired(expiresAt, new Date("2026-07-31T00:10:00.000Z"))).toBe(true);
  });
});
```

### Validation đã chạy

```bash
npm run typecheck --workspace apps/api
npm run lint --workspace apps/api
npm run test --workspace apps/api -- auth/credential-token.service.test.ts
npm run db:validate
```

### Kết quả hiện tại

- Code Draft: DONE
- Runtime Applied: YES
- Test Executed: YES
- Boundary Guard: YES — `eslint.config.mjs` blocks auth service direct DB imports.
- Next Action: implement P2-003 register/login/logout/refresh APIs; do not start P2-004.

## P2-003 — Register/login/logout/refresh APIs

### Status

VERIFIED

### Mục tiêu

Mở API auth tối thiểu cho account toàn cục: register, login, refresh rotation, logout. Không thêm tenant context, không role, không P2-004 security test suite.

### Runtime Applied

YES

### Target Files

- `apps/api/src/app.ts` — sửa, mount auth router và cookie parser.
- `apps/api/src/modules/auth/auth.repository.ts` — sửa, thêm session persistence methods.
- `apps/api/src/modules/auth/auth.schemas.ts` — tạo mới.
- `apps/api/src/modules/auth/auth.service.ts` — tạo mới.
- `apps/api/src/modules/auth/auth.controller.ts` — tạo mới.
- `apps/api/src/modules/auth/auth.routes.ts` — tạo mới.

### Code

```typescript
// Task ID: P2-003
// Target: apps/api/src/app.ts
// Operation: MODIFY
// Status: IMPLEMENTED
// Runtime Applied: YES

import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./common/middleware/errorHandler";
import { notFoundHandler } from "./common/middleware/notFound";
import { requestIdMiddleware } from "./common/middleware/requestId";
import { corsMiddleware, helmetMiddleware, jsonBodyParser, rateLimitMiddleware } from "./common/middleware/security";
import { getMeta, getReady } from "./modules/health/health.controller";
import { authRouter } from "./modules/auth/auth.routes";
import { healthRouter } from "./modules/health/health.routes";

export function createApp() {
  const app = express();

  app.use(requestIdMiddleware);
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(jsonBodyParser);
  app.use(cookieParser());
  app.use(rateLimitMiddleware);

  app.use("/auth", authRouter);
  app.use("/health", healthRouter);
  app.get("/ready", getReady);
  app.get("/api/v1/meta", getMeta);

  if (process.env.NODE_ENV === "test") {
    app.get("/__test/error", () => {
      throw new Error("Raw test stack marker");
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
```

```typescript
// Task ID: P2-003
// Target: apps/api/src/modules/auth/auth.repository.ts
// Operation: MODIFY
// Status: IMPLEMENTED
// Runtime Applied: YES

import type { AccountTokenPurpose, AccountStatus, Prisma } from "../../generated/prisma/client";
import { prisma } from "../../database/prisma";

type AuthDbClient = typeof prisma | Prisma.TransactionClient;

function getAuthDb(db?: AuthDbClient): AuthDbClient {
  return db ?? prisma;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function findAccountByEmail(email: string) {
  return prisma.account.findUnique({
    where: { email: normalizeEmail(email) },
    include: { credentials: true },
  });
}

function findAccountById(id: string) {
  return prisma.account.findUnique({
    where: { id },
    include: { credentials: true },
  });
}

function createAccountWithPassword(input: {
  email: string;
  fullName: string;
  passwordHash: string;
  status?: AccountStatus;
}) {
  return prisma.account.create({
    data: {
      email: normalizeEmail(input.email),
      fullName: input.fullName.trim(),
      status: input.status ?? "pending_verification",
      credentials: {
        create: {
          passwordHash: input.passwordHash,
        },
      },
    },
    include: { credentials: true },
  });
}

function updateLastLoginAt(accountId: string, now = new Date()) {
  return prisma.account.update({
    where: { id: accountId },
    data: { lastLoginAt: now },
  });
}

function createSession(input: {
  accountId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  rotatedFromSessionId?: string;
  db?: AuthDbClient;
}) {
  return getAuthDb(input.db).session.create({
    data: {
      accountId: input.accountId,
      refreshTokenHash: input.refreshTokenHash,
      expiresAt: input.expiresAt,
      ...(input.userAgent ? { userAgent: input.userAgent } : {}),
      ...(input.ipAddress ? { ipAddress: input.ipAddress } : {}),
      ...(input.rotatedFromSessionId ? { rotatedFromSessionId: input.rotatedFromSessionId } : {}),
    },
  });
}

function findSessionByRefreshTokenHash(refreshTokenHash: string, db?: AuthDbClient) {
  return getAuthDb(db).session.findUnique({
    where: { refreshTokenHash },
    include: { account: true },
  });
}

function markSessionRevoked(id: string, revokedAt: Date, db?: AuthDbClient) {
  return getAuthDb(db).session.update({
    where: { id },
    data: { status: "revoked", revokedAt },
  });
}

function markSessionExpired(id: string, db?: AuthDbClient) {
  return getAuthDb(db).session.update({
    where: { id },
    data: { status: "expired" },
  });
}

function markSessionReused(id: string, reusedAt: Date, db?: AuthDbClient) {
  return getAuthDb(db).session.update({
    where: { id },
    data: { reusedAt },
  });
}

function revokeActiveSessionsForAccount(accountId: string, revokedAt: Date, db?: AuthDbClient) {
  return getAuthDb(db).session.updateMany({
    where: { accountId, status: "active" },
    data: { status: "revoked", revokedAt },
  });
}

function markEmailVerified(accountId: string, now = new Date()) {
  return prisma.account.update({
    where: { id: accountId },
    data: { status: "active", emailVerifiedAt: now },
  });
}

function createStoredAccountToken(input: {
  accountId: string;
  purpose: AccountTokenPurpose;
  tokenHash: string;
  expiresAt: Date;
  db?: AuthDbClient;
}) {
  return getAuthDb(input.db).accountToken.create({
    data: {
      accountId: input.accountId,
      purpose: input.purpose,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
    },
  });
}

function findAccountTokenByHash(tokenHash: string, db?: AuthDbClient) {
  return getAuthDb(db).accountToken.findUnique({
    where: { tokenHash },
  });
}

function markAccountTokenConsumed(id: string, consumedAt: Date, db?: AuthDbClient) {
  return getAuthDb(db).accountToken.update({
    where: { id },
    data: { status: "consumed", consumedAt },
  });
}

function markAccountTokenExpired(id: string, db?: AuthDbClient) {
  return getAuthDb(db).accountToken.update({
    where: { id },
    data: { status: "expired" },
  });
}

async function revokeStoredAccountTokens(input: {
  accountId: string;
  purpose: AccountTokenPurpose;
  revokedAt: Date;
  db?: AuthDbClient;
}): Promise<number> {
  const result = await getAuthDb(input.db).accountToken.updateMany({
    where: {
      accountId: input.accountId,
      purpose: input.purpose,
      status: "active",
    },
    data: {
      status: "revoked",
      revokedAt: input.revokedAt,
    },
  });

  return result.count;
}

function runAuthTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  return prisma.$transaction(callback);
}

export {
  type AuthDbClient,
  createAccountWithPassword,
  createSession,
  createStoredAccountToken,
  findAccountByEmail,
  findAccountById,
  findAccountTokenByHash,
  findSessionByRefreshTokenHash,
  markAccountTokenConsumed,
  markAccountTokenExpired,
  markEmailVerified,
  markSessionExpired,
  markSessionReused,
  markSessionRevoked,
  normalizeEmail,
  revokeActiveSessionsForAccount,
  revokeStoredAccountTokens,
  runAuthTransaction,
  updateLastLoginAt,
};
```

```typescript
// Task ID: P2-003
// Target: apps/api/src/modules/auth/auth.schemas.ts
// Operation: CREATE
// Status: IMPLEMENTED
// Runtime Applied: YES

import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  fullName: z.string().trim().min(1).max(200),
  password: z.string().min(12),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export { loginSchema, registerSchema };
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

```typescript
// Task ID: P2-003
// Target: apps/api/src/modules/auth/auth.service.ts
// Operation: CREATE
// Status: IMPLEMENTED
// Runtime Applied: YES

import { AppError } from "../../common/errors/AppError";
import {
  createOpaqueRefreshToken,
  getRefreshTokenExpiresAt,
  hashRefreshToken,
  signAccessToken,
} from "../../common/auth/token";
import { hashAccountPassword, verifyAccountPassword } from "./credential.service";
import {
  createAccountWithPassword,
  createSession,
  findAccountByEmail,
  findSessionByRefreshTokenHash,
  markSessionExpired,
  markSessionReused,
  markSessionRevoked,
  revokeActiveSessionsForAccount,
  runAuthTransaction,
  updateLastLoginAt,
} from "./auth.repository";
import type { LoginInput, RegisterInput } from "./auth.schemas";

type RequestContext = {
  userAgent?: string;
  ipAddress?: string;
};

type AccountDto = {
  id: string;
  email: string;
  fullName: string;
  status: string;
};

type AuthResult = {
  account: AccountDto;
  accessToken: string;
  refreshToken: string;
};

function toAccountDto(account: { id: string; email: string; fullName: string; status: string }): AccountDto {
  return {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    status: account.status,
  };
}

function assertActiveAccount(account: { status: string }): void {
  if (account.status === "disabled") {
    throw new AppError(403, "ACCOUNT_DISABLED", "Account is disabled");
  }

  if (account.status !== "active") {
    throw new AppError(403, "ACCOUNT_NOT_ACTIVE", "Account is not active");
  }
}

async function createSessionTokens(account: AccountDto, context: RequestContext, rotatedFromSessionId?: string): Promise<AuthResult> {
  const refreshToken = createOpaqueRefreshToken();
  const session = await createSession({
    accountId: account.id,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt: getRefreshTokenExpiresAt(),
    ...(context.userAgent ? { userAgent: context.userAgent } : {}),
    ...(context.ipAddress ? { ipAddress: context.ipAddress } : {}),
    ...(rotatedFromSessionId ? { rotatedFromSessionId } : {}),
  });

  return {
    account,
    accessToken: signAccessToken({ sub: account.id, sessionId: session.id, email: account.email }),
    refreshToken,
  };
}

async function register(input: RegisterInput, context: RequestContext): Promise<AuthResult> {
  const existingAccount = await findAccountByEmail(input.email);
  if (existingAccount) {
    throw new AppError(409, "ACCOUNT_EMAIL_EXISTS", "Account email already exists");
  }

  const passwordHash = await hashAccountPassword(input.password);
  const account = await createAccountWithPassword({
    email: input.email,
    fullName: input.fullName,
    passwordHash,
    status: "active",
  });

  return createSessionTokens(toAccountDto(account), context);
}

async function login(input: LoginInput, context: RequestContext): Promise<AuthResult> {
  const account = await findAccountByEmail(input.email);
  const passwordCredential = account?.credentials.find((credential) => credential.type === "password");

  if (!account || !passwordCredential) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const passwordMatches = await verifyAccountPassword(passwordCredential.passwordHash, input.password);
  if (!passwordMatches) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  assertActiveAccount(account);
  await updateLastLoginAt(account.id);

  return createSessionTokens(toAccountDto(account), context);
}

async function refresh(refreshToken: string, context: RequestContext): Promise<AuthResult> {
  const now = new Date();
  const session = await findSessionByRefreshTokenHash(hashRefreshToken(refreshToken));

  if (!session) {
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
  }

  if (session.status !== "active") {
    await markSessionReused(session.id, now);
    await revokeActiveSessionsForAccount(session.accountId, now);
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
  }

  if (session.expiresAt.getTime() <= now.getTime()) {
    await markSessionExpired(session.id);
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
  }

  assertActiveAccount(session.account);

  return runAuthTransaction(async (db) => {
    await markSessionRevoked(session.id, now, db);
    const nextRefreshToken = createOpaqueRefreshToken();
    const nextSession = await createSession({
      accountId: session.accountId,
      refreshTokenHash: hashRefreshToken(nextRefreshToken),
      expiresAt: getRefreshTokenExpiresAt(),
      rotatedFromSessionId: session.id,
      ...(context.userAgent ? { userAgent: context.userAgent } : {}),
      ...(context.ipAddress ? { ipAddress: context.ipAddress } : {}),
      db,
    });

    const account = toAccountDto(session.account);
    return {
      account,
      accessToken: signAccessToken({ sub: account.id, sessionId: nextSession.id, email: account.email }),
      refreshToken: nextRefreshToken,
    };
  });
}

async function logout(refreshToken?: string): Promise<void> {
  if (!refreshToken) {
    return;
  }

  const session = await findSessionByRefreshTokenHash(hashRefreshToken(refreshToken));
  if (session?.status === "active") {
    await markSessionRevoked(session.id, new Date());
  }
}

export { type AuthResult, login, logout, refresh, register };
```

```typescript
// Task ID: P2-003
// Target: apps/api/src/modules/auth/auth.controller.ts
// Operation: CREATE
// Status: IMPLEMENTED
// Runtime Applied: YES

import type { Request, Response } from "express";
import { clearRefreshCookie, setRefreshCookie } from "../../common/auth/cookie";
import { env } from "../../config/env";
import { sendSuccess } from "../../common/responses/apiResponse";
import { login, logout, refresh, register } from "./auth.service";
import type { LoginInput, RegisterInput } from "./auth.schemas";

function getRequestContext(req: Request) {
  const context: { userAgent?: string; ipAddress?: string } = {};
  const userAgent = req.get("user-agent");

  if (userAgent) {
    context.userAgent = userAgent;
  }

  if (req.ip) {
    context.ipAddress = req.ip;
  }

  return context;
}

function getRefreshToken(req: Request): string | undefined {
  const cookies = req.cookies as unknown;
  if (!cookies || typeof cookies !== "object") {
    return undefined;
  }

  const value = (cookies as Record<string, unknown>)[env.REFRESH_TOKEN_COOKIE_NAME];
  return typeof value === "string" ? value : undefined;
}

async function registerAccount(req: Request, res: Response): Promise<void> {
  const result = await register(req.body as RegisterInput, getRequestContext(req));
  setRefreshCookie(res, result.refreshToken);
  sendSuccess(res, { account: result.account, accessToken: result.accessToken }, 201);
}

async function loginAccount(req: Request, res: Response): Promise<void> {
  const result = await login(req.body as LoginInput, getRequestContext(req));
  setRefreshCookie(res, result.refreshToken);
  sendSuccess(res, { account: result.account, accessToken: result.accessToken });
}

async function refreshSession(req: Request, res: Response): Promise<void> {
  const token = getRefreshToken(req);
  const result = await refresh(token ?? "", getRequestContext(req));
  setRefreshCookie(res, result.refreshToken);
  sendSuccess(res, { account: result.account, accessToken: result.accessToken });
}

async function logoutAccount(req: Request, res: Response): Promise<void> {
  await logout(getRefreshToken(req));
  clearRefreshCookie(res);
  sendSuccess(res, { loggedOut: true });
}

export { loginAccount, logoutAccount, refreshSession, registerAccount };
```

```typescript
// Task ID: P2-003
// Target: apps/api/src/modules/auth/auth.routes.ts
// Operation: CREATE
// Status: IMPLEMENTED
// Runtime Applied: YES

import { Router } from "express";
import { validateRequest } from "../../common/validation/validateRequest";
import { loginSchema, registerSchema } from "./auth.schemas";
import { loginAccount, logoutAccount, refreshSession, registerAccount } from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", validateRequest({ body: registerSchema }), registerAccount);
authRouter.post("/login", validateRequest({ body: loginSchema }), loginAccount);
authRouter.post("/refresh", refreshSession);
authRouter.post("/logout", logoutAccount);

export { authRouter };
```

### Validation đã chạy

```bash
npm run typecheck --workspace apps/api
npm run lint --workspace apps/api
npm run db:validate
ADMIN_PASSWORD=change-me-admin-password npx tsx -e '<supertest smoke: register/login/refresh/logout>'
```

### Smoke Result

```text
register 201 true true 1
login 200 true true 1
refresh 200 true true 1
logout 200 true
```

### Kết quả hiện tại

- Code Draft: DONE
- Runtime Applied: YES
- Test Executed: YES — typecheck, lint, db validate, runtime smoke.
- Boundary Guard: YES — service không import Prisma DB trực tiếp.
- Next Action: implement P2-004 session cookie/security tests; do not start P2-005.

## P2-004 — Session cookie/security tests

### Status

VERIFIED

### Mục tiêu

Khóa behavior bảo mật session/cookie sau P2-003: cookie flags, safe auth errors, refresh reuse, logout revoke.

### Runtime Applied

YES

### Target Files

- `apps/api/src/common/auth/cookie.ts` — sửa clear cookie để set `Max-Age=0` và `Expires`.
- `apps/api/vitest.setup.ts` — sửa để test override được `DATABASE_URL`.
- `apps/api/tests/auth/session-security.test.ts` — tạo local test; folder đang bị `.gitignore` bỏ qua.

### Code

```typescript
// Task ID: P2-004
// Target: apps/api/src/common/auth/cookie.ts
// Operation: MODIFY
// Status: VERIFIED
// Runtime Applied: YES

import type { CookieOptions, Response } from "express";
import { env } from "../../config/env";

export function getRefreshCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE || env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/auth",
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  };
}

export function setRefreshCookie(res: Response, token: string): void {
  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, token, getRefreshCookieOptions());
}

export function clearRefreshCookie(res: Response): void {
  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, "", {
    ...getRefreshCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  });
}
```

```typescript
// Task ID: P2-004
// Target: apps/api/vitest.setup.ts
// Operation: MODIFY
// Status: VERIFIED
// Runtime Applied: YES

process.env.NODE_ENV ??= "test";
process.env.PORT ??= "4001";
process.env.DATABASE_URL ??= "postgresql://thesiflow:thesiflow_dev_password@localhost:5432/thesiflow?schema=public";
process.env.FRONTEND_URL ??= "http://localhost:3000";
process.env.CORS_ORIGIN ??= "http://localhost:3000";
process.env.JSON_BODY_LIMIT ??= "1mb";
process.env.RATE_LIMIT_WINDOW_MS ??= "60000";
process.env.RATE_LIMIT_MAX ??= "1000";
process.env.LOG_LEVEL ??= "error";
process.env.ACCESS_TOKEN_SECRET ??= "test-access-token-secret-min-32-chars";
process.env.REFRESH_TOKEN_SECRET ??= "test-refresh-token-secret-min-32-chars";
process.env.ADMIN_EMAIL ??= "admin@thesiflow.local";
process.env.ADMIN_PASSWORD ??= "change-me-admin-password";
```

```typescript
// Task ID: P2-004
// Target: apps/api/tests/auth/session-security.test.ts
// Operation: CREATE_LOCAL_IGNORED
// Status: VERIFIED
// Runtime Applied: YES

import request from "supertest";
import { afterAll, afterEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/database/prisma";

const app = createApp();
const password = "correct horse battery staple";
const createdEmails = new Set<string>();

function uniqueEmail() {
  const email = `p2-004-${Date.now()}-${Math.random().toString(16).slice(2)}@example.test`;
  createdEmails.add(email);
  return email;
}

function refreshCookie(response: request.Response): string[] {
  const cookies = response.headers["set-cookie"];
  return Array.isArray(cookies) ? cookies : [];
}

async function registerAccount() {
  const email = uniqueEmail();
  const response = await request(app)
    .post("/auth/register")
    .send({ email, fullName: "P2 Security", password });

  expect(response.status).toBe(201);
  return { email, response };
}

afterEach(async () => {
  await prisma.account.deleteMany({ where: { email: { in: [...createdEmails] } } });
  createdEmails.clear();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Phase 2 session cookie/security", () => {
  it("sets refresh cookie with safe flags", async () => {
    const { response } = await registerAccount();
    const [cookie] = refreshCookie(response);

    expect(cookie).toContain("refresh_token=");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/auth");
    expect(cookie).toContain("Max-Age=");
  });

  it("returns safe login error for missing account and wrong password", async () => {
    const missing = await request(app)
      .post("/auth/login")
      .send({ email: uniqueEmail(), password });

    const { email } = await registerAccount();
    const wrongPassword = await request(app)
      .post("/auth/login")
      .send({ email, password: "wrong password value" });

    expect(missing.status).toBe(401);
    expect(wrongPassword.status).toBe(401);
    expect(missing.body.error.code).toBe("INVALID_CREDENTIALS");
    expect(wrongPassword.body.error.code).toBe("INVALID_CREDENTIALS");
    expect(missing.body.error.message).toBe(wrongPassword.body.error.message);
  });

  it("rotates refresh tokens and revokes the chain on reuse", async () => {
    const { response } = await registerAccount();
    const firstCookie = refreshCookie(response);

    const refreshed = await request(app).post("/auth/refresh").set("Cookie", firstCookie);
    expect(refreshed.status).toBe(200);

    const reused = await request(app).post("/auth/refresh").set("Cookie", firstCookie);
    expect(reused.status).toBe(401);
    expect(reused.body.error.code).toBe("INVALID_REFRESH_TOKEN");

    const secondCookie = refreshCookie(refreshed);
    const revokedChain = await request(app).post("/auth/refresh").set("Cookie", secondCookie);
    expect(revokedChain.status).toBe(401);
  });

  it("logout revokes session and clears refresh cookie", async () => {
    const { response } = await registerAccount();
    const cookie = refreshCookie(response);

    const logout = await request(app).post("/auth/logout").set("Cookie", cookie);
    expect(logout.status).toBe(200);
    expect(refreshCookie(logout)[0]).toContain("refresh_token=");
    expect(refreshCookie(logout)[0]).toContain("Max-Age=0");

    const afterLogout = await request(app).post("/auth/refresh").set("Cookie", cookie);
    expect(afterLogout.status).toBe(401);
  });
});
```

### Validation đã chạy

```bash
DATABASE_URL=postgresql://thesiflow:12345678@localhost:5433/thesiflow?schema=public npm run test --workspace apps/api -- auth/session-security.test.ts
```

### Kết quả hiện tại

- Code Draft: DONE
- Runtime Applied: YES
- Test Executed: YES — 4/4 PASS.
- Next Action: P2-005 minimal auth UI.

## P2-005 — Minimal auth UI draft

### Status

VERIFIED

### Mục tiêu

Thêm UI tối thiểu cho register/login/logout trên homepage để xác minh vertical slice Phase 2. Không thêm tenant switch, role UI, profile domain.

### Runtime Applied

YES

### Target Files

- `apps/web/src/lib/apiClient.ts` — sửa, thêm `apiPost` với credentials include.
- `apps/web/src/features/auth/auth.api.ts` — tạo mới.
- `apps/web/src/features/auth/AuthPanel.tsx` — tạo mới.
- `apps/web/src/app/page.tsx` — sửa, hiển thị auth panel Phase 2.

### Code

```typescript
// Task ID: P2-005
// Target: apps/web/src/lib/apiClient.ts
// Operation: MODIFY
// Status: VERIFIED
// Runtime Applied: YES

import { webEnv } from "../config/env";

const apiBaseUrl = webEnv.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");

export async function apiGet<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  const payload = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `Request failed with status ${response.status}`);
  }

  return payload as TResponse;
}

export async function apiPost<TResponse, TBody extends Record<string, unknown>>(path: string, body?: TBody): Promise<TResponse> {
  const init: RequestInit = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    credentials: "include"
  };

  if (body) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, init);

  const payload = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `Request failed with status ${response.status}`);
  }

  return payload as TResponse;
}
```

```typescript
// Task ID: P2-005
// Target: apps/web/src/features/auth/auth.api.ts
// Operation: CREATE
// Status: VERIFIED
// Runtime Applied: YES

import { apiPost } from "../../lib/apiClient";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta: {
    requestId: string;
    correlationId: string;
    timestamp: string;
  };
};

export type AuthAccount = {
  id: string;
  email: string;
  fullName: string;
  status: string;
};

export type AuthResponse = {
  account: AuthAccount;
  accessToken: string;
};

export function registerAccount(input: { email: string; fullName: string; password: string }) {
  return apiPost<ApiSuccessResponse<AuthResponse>, typeof input>("/auth/register", input);
}

export function loginAccount(input: { email: string; password: string }) {
  return apiPost<ApiSuccessResponse<AuthResponse>, typeof input>("/auth/login", input);
}

export function refreshSession() {
  return apiPost<ApiSuccessResponse<AuthResponse>, Record<string, never>>("/auth/refresh");
}

export function logoutAccount() {
  return apiPost<ApiSuccessResponse<{ loggedOut: true }>, Record<string, never>>("/auth/logout");
}
```

```typescript
// Task ID: P2-005
// Target: apps/web/src/features/auth/AuthPanel.tsx
// Operation: CREATE
// Status: VERIFIED
// Runtime Applied: YES

"use client";

import { FormEvent, useState } from "react";
import { loginAccount, logoutAccount, registerAccount, type AuthAccount } from "./auth.api";

type Mode = "login" | "register";

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [account, setAccount] = useState<AuthAccount | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = mode === "register"
        ? await registerAccount({ email, fullName, password })
        : await loginAccount({ email, password });

      setAccount(response.data.account);
      setAccessToken(response.data.accessToken);
      setPassword("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    setError(null);
    await logoutAccount().catch((logoutError) => {
      setError(logoutError instanceof Error ? logoutError.message : "Logout failed");
    });
    setAccount(null);
    setAccessToken(null);
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Phase 2 Auth</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Global account session</h2>
          <p className="mt-2 text-sm text-slate-600">Account toàn cục, chưa có tenant context.</p>
        </div>
        <div className="flex rounded-full bg-slate-100 p-1 text-sm font-medium">
          <button
            className={`rounded-full px-3 py-1 ${mode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
            type="button"
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`rounded-full px-3 py-1 ${mode === "register" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
            type="button"
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={submit}>
        {mode === "register" ? (
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Full name
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-950"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>
        ) : null}
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Email
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-950"
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Password
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-950"
            minLength={12}
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button
          className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Đang xử lý..." : mode === "register" ? "Tạo account" : "Đăng nhập"}
        </button>
      </form>

      {error ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p> : null}

      {account ? (
        <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-semibold">Đã xác thực: {account.fullName}</p>
          <p className="mt-1 break-all">{account.email}</p>
          <p className="mt-1">Access token: {accessToken ? `${accessToken.slice(0, 20)}...` : "none"}</p>
          <button className="mt-3 rounded-lg bg-emerald-700 px-3 py-2 font-semibold text-white" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      ) : null}
    </section>
  );
}
```

```typescript
// Task ID: P2-005
// Target: apps/web/src/app/page.tsx
// Operation: MODIFY
// Status: VERIFIED
// Runtime Applied: YES

import { HealthStatus } from "../features/health/HealthStatus";
import { AuthPanel } from "../features/auth/AuthPanel";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">ThesiFlow</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Global Account Authentication</h1>
      <p className="mt-4 text-lg text-slate-600">
        Phase 2 xác minh account toàn cục và session an toàn. Chưa có tenant, role hoặc academic workflow.
      </p>
      <AuthPanel />
      <HealthStatus />
    </main>
  );
}
```

### Validation đã chạy

```bash
npm run typecheck --workspace apps/web
npm run lint --workspace apps/web
npm run build --workspace apps/web
```

### Kết quả hiện tại

- Code Draft: DONE
- Runtime Applied: YES
- Test Executed: YES — web typecheck/lint/build PASS.
- Next Action: Phase 2 DONE; start Phase 3 planning with P3-001.

## P2-006 Runtime Implementation — Email verification, password reset, `/auth/me`

### Status

VERIFIED

### Runtime Applied

YES

### Target Files

- `apps/api/src/modules/auth/auth.repository.ts` — thêm update password credential qua repository.
- `apps/api/src/modules/auth/auth.schemas.ts` — thêm schema verify email, forgot password, reset password.
- `apps/api/src/modules/auth/auth.service.ts` — register pending, verify email token, forgot/reset password, `/auth/me` lookup.
- `apps/api/src/modules/auth/auth.controller.ts` — thêm controller endpoint lifecycle.
- `apps/api/src/modules/auth/auth.routes.ts` — thêm route lifecycle.
- `apps/api/tests/auth/account-lifecycle.test.ts` — lifecycle integration test.
- `apps/api/tests/auth/session-security.test.ts` — cập nhật helper theo register pending.
- `apps/web/src/features/auth/auth.api.ts` — thêm client API lifecycle.
- `apps/web/src/features/auth/AuthPanel.tsx` — UI dev tối thiểu cho verify/reset token.

### Implemented Behavior

- `POST /auth/register`: tạo `Account.status = pending_verification`, không set refresh cookie, không trả access token.
- `POST /auth/verify-email`: consume one-time `email_verification` token, set account active.
- `POST /auth/login`: chỉ account active mới đăng nhập được.
- `POST /auth/forgot-password`: trả `{ requested: true }` để tránh account enumeration; non-production trả `resetToken` để dev/test dùng khi chưa có mail provider.
- `POST /auth/reset-password`: consume one-time `password_reset` token, đổi password, revoke active sessions.
- `GET /auth/me`: đọc Bearer access token, trả current active account.

### Validation Executed

```bash
npm run db:validate
npm run typecheck --workspace apps/api
npm run lint --workspace apps/api
npm run typecheck --workspace apps/web
npm run lint --workspace apps/web
npm run build --workspace apps/api
npm run build --workspace apps/web
DATABASE_URL=postgresql://thesiflow:12345678@localhost:5433/thesiflow?schema=public npm run test --workspace apps/api -- auth/account-lifecycle.test.ts auth/session-security.test.ts
```

### Validation Result

PASS

### Deferred

Email provider thật chưa thêm. Hiện dùng dev/test token response; thêm mail provider khi Phase notification/email infrastructure được mở.

### SMTP closure 2026-08-03

- Added dependency: `nodemailer`, `@types/nodemailer`.
- Added env keys: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`.
- Added mailer: `apps/api/src/common/mail/mailer.ts`.
- `register` now sends `/verify-email?token=...` link when SMTP is configured.
- `forgotPassword` now sends `/reset-password?token=...` link when SMTP is configured.
- Test mode skips SMTP delivery to keep integration tests deterministic.
- Added web pages: `apps/web/src/app/verify-email/page.tsx`, `apps/web/src/app/reset-password/page.tsx`.
- Runtime Applied: YES.
- Validation: db validate, API/web typecheck/lint/build, auth lifecycle/session tests PASS.
- SMTP Validation: `SMTP_VERIFY_OK`; `SMTP_SEND_OK 1` to configured `SMTP_USER`.

### SMTP template polish 2026-08-03

- Updated `apps/api/src/common/mail/mailer.ts` to use a branded HTML email layout.
- Added email-safe table layout, dark header, CTA button, fallback URL, preview text, safety note, and no-reply footer.
- Added HTML escaping for dynamic `fullName`, URL, and text fields.
- Runtime Applied: YES.
- Validation: API typecheck/lint/build PASS; `auth/account-lifecycle.test.ts` PASS outside sandbox; preview register email sent to configured Gmail alias.

### Auth UI production polish 2026-08-03

- Replaced test-style auth panel with production-style ThesiFlow login/register surface.
- Removed manual verification/reset token panels from main login UI; email links remain handled by `/verify-email` and `/reset-password`.
- Added branded landing copy aligned to APLP lifecycle scope from `docs/BaoCaoKhoaLuan.docx`.
- Simplified health card to system readiness indicator instead of debug metadata.
- Runtime Applied: YES.
- Validation: web typecheck/lint/build PASS.
- Ops: stopped `thesiflow-web` Docker container to free port `3000`.

### Hybrid auth security refactor 2026-08-03

- Status: VERIFIED
- Runtime Applied: YES
- Code Status: IMPLEMENTED
- Task ID: P2-HOTFIX
- Target files changed:
  - `apps/api/prisma/schema.prisma`
  - `apps/api/prisma/migrations/20260803143000_add_session_family_id/migration.sql`
  - `apps/api/prisma/migrations/20260803145500_add_auth_audit_actions/migration.sql`
  - `apps/api/src/common/middleware/security.ts`
  - `apps/api/src/modules/auth/auth.controller.ts`
  - `apps/api/src/modules/auth/auth.repository.ts`
  - `apps/api/src/modules/auth/auth.routes.ts`
  - `apps/api/src/modules/auth/auth.service.ts`
  - `apps/web/src/features/auth/accessTokenStore.ts`
  - `apps/web/src/features/auth/AuthProvider.tsx`
  - `apps/web/src/features/auth/auth.api.ts`
  - `apps/web/src/lib/apiClient.ts`
  - `apps/web/src/app/providers.tsx`
  - `apps/web/src/features/auth/AuthPanel.tsx`
  - `apps/api/tests/auth/account-lifecycle.test.ts`
  - `apps/api/tests/auth/session-security.test.ts`
  - `apps/api/tests/auth/frontend-auth-boundary.test.ts`
- Implemented:
  - Login/refresh response now returns `{ account, accessToken }`; refresh token remains HttpOnly cookie only.
  - Access token is memory-only on frontend via `accessTokenStore`; no storage API use.
  - API client centralizes GET/POST/PUT/PATCH/DELETE, attaches Bearer token, uses `credentials: "include"`, performs single-flight refresh, retries once, emits auth-expired on refresh failure.
  - Auth Provider bootstraps session once after reload through `/auth/refresh` and owns loading/authenticated/unauthenticated state.
  - Refresh rotation uses conditional `updateMany` consume to prevent two child sessions from one refresh token.
  - `Session.familyId` added; refresh reuse revokes active sessions in same family.
  - Session management endpoints added: `GET /auth/sessions`, `DELETE /auth/sessions/:sessionId`, `POST /auth/logout-all`.
  - Origin/CORS guard returns explicit 403 for untrusted origin; cookie-backed auth mutations require trusted browser origin.
  - Auth audit actions persisted for login success/failure, refresh success, refresh reuse, logout, logout-all, session revoke, reset password.
- Security policy:
  - Policy A chosen: short-lived stateless JWT access token; logout has bounded revocation window until access token expiry.
  - Sensitive session-management endpoints verify `sessionId` is still active.
  - Refresh cookie remains `HttpOnly`, `SameSite=Lax`, production `secure`, `Path=/auth`, no `Domain`.
- Validation:
  - `npm run db:migrate -- --name add_auth_audit_actions` PASS.
  - `npm run db:validate` PASS.
  - `npm run typecheck --workspace apps/api` PASS.
  - `npm run lint --workspace apps/api` PASS.
  - `npm run typecheck --workspace apps/web` PASS.
  - `npm run lint --workspace apps/web` PASS.
  - `npm run build --workspace apps/api` PASS.
  - `npm run build --workspace apps/web` PASS.
  - `DATABASE_URL=postgresql://thesiflow:12345678@localhost:5433/thesiflow?schema=public npm run test --workspace apps/api` PASS — 15 files / 42 tests.
- Next Action: Continue Phase 3 P3-001; do not re-open Phase 2 unless a new auth bug is reported.
