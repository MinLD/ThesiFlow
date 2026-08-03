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
  createSession,
  findAccountByEmail,
  findAccountById,
  findSessionByRefreshTokenHash,
  markSessionExpired,
  markSessionReused,
  markSessionRevoked,
  revokeActiveSessionsForAccount,
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
import { sendEmailVerificationMail, sendPasswordResetMail } from "../../common/mail/mailer";

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

type RegisterResult = {
  account: AccountDto;
  verificationToken?: string;
};

type TokenRequestResult = {
  requested: true;
  resetToken?: string;
};

function toAccountDto(account: {
  id: string;
  email: string;
  fullName: string;
  status: string;
}): AccountDto {
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

async function createSessionTokens(
  account: AccountDto,
  context: RequestContext,
  rotatedFromSessionId?: string,
): Promise<AuthResult> {
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
    accessToken: signAccessToken({
      sub: account.id,
      sessionId: session.id,
      email: account.email,
    }),
    refreshToken,
  };
}

function exposeDevToken(token: string): string | undefined {
  return env.NODE_ENV === "production" ? undefined : token;
}

async function register(input: RegisterInput): Promise<RegisterResult> {
  const existingAccount = await findAccountByEmail(input.email);
  if (existingAccount) {
    throw new AppError(
      409,
      "ACCOUNT_EMAIL_EXISTS",
      "Account email already exists",
    );
  }

  const passwordHash = await hashAccountPassword(input.password);
  const account = await createAccountWithPassword({
    email: input.email,
    fullName: input.fullName,
    passwordHash,
  });
  const verification = await createAccountToken({
    accountId: account.id,
    purpose: "email_verification",
  });
  await sendEmailVerificationMail({
    to: account.email,
    fullName: account.fullName,
    token: verification.token,
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
): Promise<AuthResult> {
  const account = await findAccountByEmail(input.email);
  const passwordCredential = account?.credentials[0];

  if (!account || !passwordCredential) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const passwordMatches = await verifyAccountPassword(
    passwordCredential.passwordHash,
    input.password,
  );
  if (!passwordMatches) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  assertActiveAccount(account);
  await updateLastLoginAt(account.id);

  return createSessionTokens(toAccountDto(account), context);
}

async function refresh(
  refreshToken: string,
  context: RequestContext,
): Promise<AuthResult> {
  const now = new Date();
  const session = await findSessionByRefreshTokenHash(
    hashRefreshToken(refreshToken),
  );

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
      accessToken: signAccessToken({
        sub: account.id,
        sessionId: nextSession.id,
        email: account.email,
      }),
      refreshToken: nextRefreshToken,
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
  }
}

async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<TokenRequestResult> {
  const account = await findAccountByEmail(input.email);
  if (!account || account.status === "disabled") {
    return { requested: true };
  }

  await revokeAccountTokens({
    accountId: account.id,
    purpose: "password_reset",
  });
  const reset = await createAccountToken({
    accountId: account.id,
    purpose: "password_reset",
  });
  await sendPasswordResetMail({
    to: account.email,
    fullName: account.fullName,
    token: reset.token,
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
  });

  return { reset: true };
}

async function getCurrentAccount(
  accessToken?: string,
): Promise<{ account: AccountDto }> {
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
    return { account: toAccountDto(account) };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(401, "UNAUTHENTICATED", "Authentication required");
  }
}

export {
  type AuthResult,
  type RegisterResult,
  forgotPassword,
  getCurrentAccount,
  login,
  logout,
  refresh,
  register,
  resetPassword,
  verifyEmail,
};
