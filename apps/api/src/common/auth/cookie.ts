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
