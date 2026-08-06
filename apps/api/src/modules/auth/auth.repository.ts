import type { AccountStatus, AccountTokenPurpose, AuditAction, Prisma } from "../../generated/prisma/client";
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
  db?: AuthDbClient;
}) {
  return getAuthDb(input.db).account.create({
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

function createAuthAuditLog(input: {
  action: AuditAction;
  accountId?: string;
  sessionId?: string;
  familyId?: string;
  reason?: string;
  db?: AuthDbClient;
}) {
  return getAuthDb(input.db).auditLog.create({
    data: {
      action: input.action,
      resource: input.sessionId ? "session" : "account",
      resourceId: input.sessionId ?? input.accountId ?? null,
      metadata: {
        ...(input.accountId ? { accountId: input.accountId } : {}),
        ...(input.sessionId ? { sessionId: input.sessionId } : {}),
        ...(input.familyId ? { familyId: input.familyId } : {}),
        ...(input.reason ? { reason: input.reason } : {}),
      },
    },
  });
}

function enqueueAuthMail(input: {
  accountId: string;
  mail: {
    to: string;
    subject: string;
    text: string;
    html: string;
  };
  purpose: "email_verification" | "password_reset";
  db?: AuthDbClient;
}) {
  return getAuthDb(input.db).outboxEvent.create({
    data: {
      eventType: "mail.send.v1",
      aggregateType: "account",
      aggregateId: input.accountId,
      payload: {
        ...input.mail,
        purpose: input.purpose,
      },
    },
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
  familyId: string;
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
      familyId: input.familyId,
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

function findSessionById(id: string, db?: AuthDbClient) {
  return getAuthDb(db).session.findUnique({
    where: { id },
    include: { account: true },
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

async function consumeActiveSession(input: {
  id: string;
  now: Date;
  db?: AuthDbClient;
}): Promise<number> {
  const result = await getAuthDb(input.db).session.updateMany({
    where: {
      id: input.id,
      status: "active",
      expiresAt: { gt: input.now },
    },
    data: { status: "revoked", revokedAt: input.now },
  });

  return result.count;
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

function revokeActiveSessionsForFamily(
  familyId: string,
  revokedAt: Date,
  db?: AuthDbClient,
) {
  return getAuthDb(db).session.updateMany({
    where: { familyId, status: "active" },
    data: { status: "revoked", revokedAt },
  });
}

function listSessionsForAccount(accountId: string) {
  return prisma.session.findMany({
    where: { accountId },
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      expiresAt: true,
      revokedAt: true,
      reusedAt: true,
      userAgent: true,
      ipAddress: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function revokeSessionForAccount(input: {
  accountId: string;
  sessionId: string;
  revokedAt: Date;
  db?: AuthDbClient;
}): Promise<number> {
  const result = await getAuthDb(input.db).session.updateMany({
    where: {
      id: input.sessionId,
      accountId: input.accountId,
      status: "active",
    },
    data: { status: "revoked", revokedAt: input.revokedAt },
  });

  return result.count;
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
  createAuthAuditLog,
  enqueueAuthMail,
  createAccountWithPassword,
  createSession,
  createStoredAccountToken,
  consumeActiveSession,
  findAccountByEmail,
  findAccountById,
  findAccountTokenByHash,
  findSessionById,
  findSessionByRefreshTokenHash,
  listSessionsForAccount,
  markAccountTokenConsumed,
  markAccountTokenExpired,
  markEmailVerified,
  markSessionExpired,
  markSessionReused,
  markSessionRevoked,
  normalizeEmail,
  revokeActiveSessionsForAccount,
  revokeActiveSessionsForFamily,
  revokeSessionForAccount,
  revokeStoredAccountTokens,
  runAuthTransaction,
  updateAccountPassword,
  updateLastLoginAt,
};
