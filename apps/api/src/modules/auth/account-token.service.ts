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

const DEFAULT_ACCOUNT_TOKEN_TTL_MINUTES = 15;

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
