import type { Request, Response } from "express";
import { AppError } from "../../common/errors/AppError";
import { clearRefreshCookie, setRefreshCookie } from "../../common/auth/cookie";
import { env } from "../../config/env";
import { sendSuccess } from "../../common/responses/apiResponse";
import {
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
} from "./auth.service";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "./auth.schemas";

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

  const value = (cookies as Record<string, unknown>)[
    env.REFRESH_TOKEN_COOKIE_NAME
  ];
  return typeof value === "string" ? value : undefined;
}

function getBearerToken(req: Request): string | undefined {
  const authorization = req.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }

  return authorization.slice("Bearer ".length).trim() || undefined;
}

function setAuthNoStore(res: Response): void {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
}

async function registerAccount(req: Request, res: Response): Promise<void> {
  const result = await register(req.body as RegisterInput);
  sendSuccess(res, result, 201);
}

async function loginAccount(req: Request, res: Response): Promise<void> {
  const result = await login(req.body as LoginInput, getRequestContext(req));
  setRefreshCookie(res, result.refreshToken);
  setAuthNoStore(res);
  sendSuccess(res, { account: result.account, accessToken: result.accessToken });
}

async function refreshSession(req: Request, res: Response): Promise<void> {
  const token = getRefreshToken(req);
  const result = await refresh(token ?? "", getRequestContext(req));
  setRefreshCookie(res, result.refreshToken);
  setAuthNoStore(res);
  sendSuccess(res, {
    account: result.account,
    accessToken: result.accessToken,
  });
}

async function logoutAccount(req: Request, res: Response): Promise<void> {
  await logout(getRefreshToken(req));
  clearRefreshCookie(res);
  sendSuccess(res, { loggedOut: true });
}

async function verifyEmailAccount(req: Request, res: Response): Promise<void> {
  sendSuccess(res, await verifyEmail(req.body as VerifyEmailInput));
}

async function forgotAccountPassword(
  req: Request,
  res: Response,
): Promise<void> {
  sendSuccess(res, await forgotPassword(req.body as ForgotPasswordInput));
}

async function resetAccountPassword(
  req: Request,
  res: Response,
): Promise<void> {
  sendSuccess(res, await resetPassword(req.body as ResetPasswordInput));
}

async function getMe(req: Request, res: Response): Promise<void> {
  sendSuccess(res, await getCurrentAccount(getBearerToken(req)));
}

async function getSessions(req: Request, res: Response): Promise<void> {
  sendSuccess(res, await listAccountSessions(getBearerToken(req)));
}

async function revokeSession(req: Request, res: Response): Promise<void> {
  const sessionIdParam = req.params.sessionId;
  const sessionId = Array.isArray(sessionIdParam) ? sessionIdParam[0] : sessionIdParam;
  if (!sessionId) {
    throw new AppError(400, "SESSION_ID_REQUIRED", "Session id is required");
  }

  const accessToken = getBearerToken(req);
  sendSuccess(res, await revokeAccountSession({
    ...(accessToken ? { accessToken } : {}),
    sessionId,
  }));
}

async function logoutAllSessions(req: Request, res: Response): Promise<void> {
  await logoutAll(getBearerToken(req));
  clearRefreshCookie(res);
  sendSuccess(res, { loggedOut: true });
}

export {
  forgotAccountPassword,
  getMe,
  getSessions,
  loginAccount,
  logoutAccount,
  logoutAllSessions,
  refreshSession,
  registerAccount,
  revokeSession,
  resetAccountPassword,
  verifyEmailAccount,
};
