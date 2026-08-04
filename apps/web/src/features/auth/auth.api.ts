"use client";

import { apiDelete, apiGet, apiPost } from "../../lib/apiClient";

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

export type RegisterResponse = {
  account: AuthAccount;
  verificationToken?: string;
};

export type SafeSession = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  revokedAt: string | null;
  reusedAt: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  current: boolean;
};

export function registerAccount(input: { email: string; fullName: string; password: string }) {
  return apiPost<ApiSuccessResponse<RegisterResponse>, typeof input>("/auth/register", input);
}

export function verifyEmail(input: { token: string }) {
  return apiPost<ApiSuccessResponse<{ account: AuthAccount }>, typeof input>("/auth/verify-email", input);
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

export function forgotPassword(input: { email: string }) {
  return apiPost<ApiSuccessResponse<{ requested: true; resetToken?: string }>, typeof input>("/auth/forgot-password", input);
}

export function resetPassword(input: { token: string; password: string }) {
  return apiPost<ApiSuccessResponse<{ reset: true }>, typeof input>("/auth/reset-password", input);
}

export function getMe() {
  return apiGet<ApiSuccessResponse<{ account: AuthAccount }>>("/auth/me");
}

export function listSessions() {
  return apiGet<ApiSuccessResponse<{ sessions: SafeSession[] }>>("/auth/sessions");
}

export function revokeSession(sessionId: string) {
  return apiDelete<ApiSuccessResponse<{ revoked: true }>>(`/auth/sessions/${sessionId}`);
}

export function logoutAllSessions() {
  return apiPost<ApiSuccessResponse<{ loggedOut: true }>, Record<string, never>>("/auth/logout-all");
}
