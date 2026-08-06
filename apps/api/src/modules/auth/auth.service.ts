import { randomUUID } from "node:crypto";
import { AppError } from "../../common/errors/AppError";
import {
  createOpaqueRefreshToken,
  getRefreshTokenExpiresAt,
  hashRefreshToken,
  signAccessToken,
  verifyAccessToken,
} from "../../common/auth/token";
import {
  hashAccountPassword,
  verifyAccountPassword,
} from "./credential.service";
import {
  consumeAccountToken,
  createAccountToken,
  revokeAccountTokens,
} from "./account-token.service";
import {
  createAccountWithPassword,
  createAuthAuditLog,
  createSession,
  consumeActiveSession,
  enqueueAuthMail,
  findAccountByEmail,
  findAccountById,
  findSessionById,
  findSessionByRefreshTokenHash,
  listSessionsForAccount,
  markSessionExpired,
  markSessionReused,
  markSessionRevoked,
  revokeActiveSessionsForAccount,
  revokeActiveSessionsForFamily,
  revokeSessionForAccount,
  runAuthTransaction,
  markEmailVerified,
  updateAccountPassword,
  updateLastLoginAt,
} from "./auth.repository";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "./auth.schemas";
import { env } from "../../config/env";
import { buildEmailVerificationMail, buildPasswordResetMail } from "../../common/mail/mailer";
import type {
  AccountDto,
  AuthTokenResultDto,
  RegisterResponseDto,
  SafeSessionDto,
  TokenRequestResponseDto,
} from "./auth.dto";
import { toAccountDto, toSafeSessionDto } from "./auth.mapper";

type RequestContext = {
  userAgent?: string;
  ipAddress?: string;
};

function assertActiveAccount(account: { status: string }): void {
  if (account.status === "disabled") {
    throw new AppError(403, "ACCOUNT_DISABLED", "Account is disabled");
  }

  if (account.status !== "active") {
    throw new AppError(403, "ACCOUNT_NOT_ACTIVE", "Account is not active");
  }
}

async function createSessionTokens(
  account: AccountDto,
  context: RequestContext,
  rotatedFromSessionId?: string,
  familyId = randomUUID(),
): Promise<AuthTokenResultDto> {
  const refreshToken = createOpaqueRefreshToken();
  const session = await createSession({
    accountId: account.id,
    familyId,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt: getRefreshTokenExpiresAt(),
    ...(context.userAgent ? { userAgent: context.userAgent } : {}),
    ...(context.ipAddress ? { ipAddress: context.ipAddress } : {}),
    ...(rotatedFromSessionId ? { rotatedFromSessionId } : {}),
  });

  return {
    account,
    accessToken: signAccessToken({
      sub: account.id,
      sessionId: session.id,
      email: account.email,
    }),
    refreshToken,
    sessionId: session.id,
  };
}

function exposeDevToken(token: string): string | undefined {
  return env.NODE_ENV === "production" ? undefined : token;
}

async function register(input: RegisterInput): Promise<RegisterResponseDto> {
  const existingAccount = await findAccountByEmail(input.email);
  if (existingAccount) {
    throw new AppError(
      409,
      "ACCOUNT_EMAIL_EXISTS",
      "Account email already exists",
    );
  }

  const passwordHash = await hashAccountPassword(input.password);
  const { account, verification } = await runAuthTransaction(async (db) => {
    const createdAccount = await createAccountWithPassword({
      email: input.email,
      fullName: input.fullName,
      passwordHash,
      db,
    });
    const createdVerification = await createAccountToken({
      accountId: createdAccount.id,
      purpose: "email_verification",
      db,
    });
    await enqueueAuthMail({
      accountId: createdAccount.id,
      purpose: "email_verification",
      mail: buildEmailVerificationMail({
        to: createdAccount.email,
        fullName: createdAccount.fullName,
        token: createdVerification.token,
      }),
      db,
    });
    await createAuthAuditLog({ action: "ACCOUNT_CREATED", accountId: createdAccount.id, db });

    return { account: createdAccount, verification: createdVerification };
  });

  return {
    account: toAccountDto(account),
    ...(exposeDevToken(verification.token)
      ? { verificationToken: verification.token }
      : {}),
  };
}

async function verifyEmail(
  input: VerifyEmailInput,
): Promise<{ account: AccountDto }> {
  const consumed = await consumeAccountToken({
    token: input.token,
    purpose: "email_verification",
  });
  if (!consumed) {
    throw new AppError(
      400,
      "INVALID_EMAIL_VERIFICATION_TOKEN",
      "Invalid email verification token",
    );
  }

  const account = await markEmailVerified(consumed.accountId);
  await revokeAccountTokens({
    accountId: account.id,
    purpose: "email_verification",
  });

  return { account: toAccountDto(account) };
}

async function login(
  input: LoginInput,
  context: RequestContext,
): Promise<AuthTokenResultDto> {
  const account = await findAccountByEmail(input.email);
  const passwordCredential = account?.credentials[0];

  if (!account || !passwordCredential) {
    await createAuthAuditLog({ action: "LOGIN_FAILED", reason: "missing_account_or_credential" });
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const passwordMatches = await verifyAccountPassword(
    passwordCredential.passwordHash,
    input.password,
  );
  if (!passwordMatches) {
    await createAuthAuditLog({ action: "LOGIN_FAILED", accountId: account.id, reason: "wrong_password" });
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  assertActiveAccount(account);
  await updateLastLoginAt(account.id);

  const result = await createSessionTokens(toAccountDto(account), context);
  await createAuthAuditLog({ action: "LOGIN_SUCCESS", accountId: account.id, sessionId: result.sessionId });
  return result;
}

async function refresh(
  refreshToken: string,
  context: RequestContext,
): Promise<AuthTokenResultDto> {
  const now = new Date();
  const session = await findSessionByRefreshTokenHash(
    hashRefreshToken(refreshToken),
  );

  if (!session) {
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
  }

  if (session.status !== "active") {
    await markSessionReused(session.id, now);
    await revokeActiveSessionsForFamily(session.familyId, now);
    await createAuthAuditLog({
      action: "REFRESH_TOKEN_REUSED",
      accountId: session.accountId,
      sessionId: session.id,
      familyId: session.familyId,
    });
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
  }

  if (session.expiresAt.getTime() <= now.getTime()) {
    await markSessionExpired(session.id);
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
  }

  assertActiveAccount(session.account);

  return runAuthTransaction(async (db) => {
    const consumedCount = await consumeActiveSession({ id: session.id, now, db });
    if (consumedCount !== 1) {
      await markSessionReused(session.id, now, db);
      await revokeActiveSessionsForFamily(session.familyId, now, db);
      await createAuthAuditLog({
        action: "REFRESH_TOKEN_REUSED",
        accountId: session.accountId,
        sessionId: session.id,
        familyId: session.familyId,
        db,
      });
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
    }

    const nextRefreshToken = createOpaqueRefreshToken();
    const nextSession = await createSession({
      accountId: session.accountId,
      familyId: session.familyId,
      refreshTokenHash: hashRefreshToken(nextRefreshToken),
      expiresAt: getRefreshTokenExpiresAt(),
      rotatedFromSessionId: session.id,
      ...(context.userAgent ? { userAgent: context.userAgent } : {}),
      ...(context.ipAddress ? { ipAddress: context.ipAddress } : {}),
      db,
    });

    const account = toAccountDto(session.account);
    await createAuthAuditLog({
      action: "TOKEN_REFRESHED",
      accountId: account.id,
      sessionId: nextSession.id,
      familyId: session.familyId,
      db,
    });

    return {
      account,
      accessToken: signAccessToken({
        sub: account.id,
        sessionId: nextSession.id,
        email: account.email,
      }),
      refreshToken: nextRefreshToken,
      sessionId: nextSession.id,
    };
  });
}

async function logout(refreshToken?: string): Promise<void> {
  if (!refreshToken) {
    return;
  }

  const session = await findSessionByRefreshTokenHash(
    hashRefreshToken(refreshToken),
  );
  if (session?.status === "active") {
    await markSessionRevoked(session.id, new Date());
    await createAuthAuditLog({ action: "LOGOUT", accountId: session.accountId, sessionId: session.id, familyId: session.familyId });
  }
}

async function getAuthenticatedContext(accessToken?: string): Promise<{
  account: AccountDto;
  sessionId: string;
}> {
  if (!accessToken) {
    throw new AppError(401, "UNAUTHENTICATED", "Authentication required");
  }

  try {
    const payload = verifyAccessToken(accessToken);
    const account = await findAccountById(payload.sub);
    if (!account) {
      throw new AppError(401, "UNAUTHENTICATED", "Authentication required");
    }

    assertActiveAccount(account);
    return { account: toAccountDto(account), sessionId: payload.sessionId };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(401, "UNAUTHENTICATED", "Authentication required");
  }
}

async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<TokenRequestResponseDto> {
  const account = await findAccountByEmail(input.email);
  if (!account || account.status === "disabled") {
    return { requested: true };
  }

  const reset = await runAuthTransaction(async (db) => {
    await revokeAccountTokens({
      accountId: account.id,
      purpose: "password_reset",
      db,
    });
    const createdReset = await createAccountToken({
      accountId: account.id,
      purpose: "password_reset",
      db,
    });
    await enqueueAuthMail({
      accountId: account.id,
      purpose: "password_reset",
      mail: buildPasswordResetMail({
        to: account.email,
        fullName: account.fullName,
        token: createdReset.token,
      }),
      db,
    });

    return createdReset;
  });

  return {
    requested: true,
    ...(exposeDevToken(reset.token) ? { resetToken: reset.token } : {}),
  };
}

async function resetPassword(
  input: ResetPasswordInput,
): Promise<{ reset: true }> {
  const consumed = await consumeAccountToken({
    token: input.token,
    purpose: "password_reset",
  });
  if (!consumed) {
    throw new AppError(
      400,
      "INVALID_PASSWORD_RESET_TOKEN",
      "Invalid password reset token",
    );
  }

  const passwordHash = await hashAccountPassword(input.password);
  const now = new Date();
  await runAuthTransaction(async (db) => {
    await updateAccountPassword({
      accountId: consumed.accountId,
      passwordHash,
      now,
      db,
    });
    await revokeActiveSessionsForAccount(consumed.accountId, now, db);
    await createAuthAuditLog({ action: "RESET_PASSWORD_SUCCESS", accountId: consumed.accountId, db });
  });

  return { reset: true };
}

async function getCurrentAccount(
  accessToken?: string,
): Promise<{ account: AccountDto }> {
  const context = await getAuthenticatedContext(accessToken);
  return { account: context.account };
}

async function listAccountSessions(accessToken?: string): Promise<{ sessions: SafeSessionDto[] }> {
  const context = await getAuthenticatedContext(accessToken);
  await assertSessionActive(context.sessionId, context.account.id);
  const sessions = await listSessionsForAccount(context.account.id);

  return {
    sessions: sessions.map((session) => toSafeSessionDto(session, context.sessionId)),
  };
}

async function revokeAccountSession(input: { accessToken?: string; sessionId: string }): Promise<{ revoked: true }> {
  const context = await getAuthenticatedContext(input.accessToken);
  await assertSessionActive(context.sessionId, context.account.id);
  await revokeSessionForAccount({
    accountId: context.account.id,
    sessionId: input.sessionId,
    revokedAt: new Date(),
  });
  await createAuthAuditLog({ action: "SESSION_REVOKED", accountId: context.account.id, sessionId: input.sessionId });

  return { revoked: true };
}

async function logoutAll(accessToken?: string): Promise<{ loggedOut: true }> {
  const context = await getAuthenticatedContext(accessToken);
  await assertSessionActive(context.sessionId, context.account.id);
  await revokeActiveSessionsForAccount(context.account.id, new Date());
  await createAuthAuditLog({ action: "LOGOUT_ALL", accountId: context.account.id, sessionId: context.sessionId });
  return { loggedOut: true };
}

async function assertSessionActive(sessionId: string, accountId: string): Promise<void> {
  const session = await findSessionById(sessionId);
  if (!session || session.accountId !== accountId || session.status !== "active" || session.expiresAt.getTime() <= Date.now()) {
    throw new AppError(401, "SESSION_NOT_ACTIVE", "Session is not active");
  }
}

export {
  forgotPassword,
  getCurrentAccount,
  listAccountSessions,
  login,
  logout,
  logoutAll,
  refresh,
  register,
  revokeAccountSession,
  resetPassword,
  verifyEmail,
};
