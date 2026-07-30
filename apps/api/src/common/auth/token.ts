import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

type AccessTokenPayload = {
  sub: string;
  tenantId: string;
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
