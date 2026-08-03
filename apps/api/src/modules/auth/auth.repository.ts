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

function updateAccountPassword(input: {
  accountId: string;
  passwordHash: string;
  now?: Date;
  db?: AuthDbClient;
}) {
  return getAuthDb(input.db).accountCredential.update({
    where: { accountId: input.accountId },
    data: {
      passwordHash: input.passwordHash,
      passwordUpdatedAt: input.now ?? new Date(),
    },
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
  updateAccountPassword,
  updateLastLoginAt,
};
