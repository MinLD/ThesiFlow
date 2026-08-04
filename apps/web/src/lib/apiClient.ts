"use client";

import { clearAccessToken, getAccessToken, setAccessToken } from "../features/auth/accessTokenStore";
import { webEnv } from "../config/env";

const apiBaseUrl = webEnv.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");
const publicAuthPaths = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh",
  "/auth/logout",
]);
const publicPaths = new Set(["/health", "/ready", "/api/v1/meta", ...publicAuthPaths]);

let refreshPromise: Promise<AuthResponse> | null = null;

type ApiErrorPayload = {
  error?: {
    message?: string;
    code?: string;
  };
};

type RequestOptions<TBody> = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  body?: TBody;
  signal?: AbortSignal;
  retried?: boolean;
};

type AuthResponse = {
  account: {
    id: string;
    email: string;
    fullName: string;
    status: string;
  };
  accessToken: string;
};

function isPublicAuthPath(path: string): boolean {
  return publicAuthPaths.has(path);
}

function isPublicPath(path: string): boolean {
  return publicPaths.has(path);
}

function emitAuthExpired(): void {
  window.dispatchEvent(new CustomEvent("thesiflow:auth-expired"));
}

async function parsePayload(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

async function refreshAccessToken(): Promise<AuthResponse> {
  if (!refreshPromise) {
    refreshPromise = apiRequest<{ success: true; data: AuthResponse }, undefined>({
      method: "POST",
      path: "/auth/refresh",
      retried: true,
    })
      .then((response) => {
        setAccessToken(response.data.accessToken);
        return response.data;
      })
      .catch((error) => {
        clearAccessToken();
        emitAuthExpired();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function apiRequest<TResponse, TBody extends Record<string, unknown> | undefined = undefined>(options: RequestOptions<TBody>): Promise<TResponse> {
  const headers = new Headers({ Accept: "application/json" });
  const hasBody = typeof options.body !== "undefined";

  if (hasBody) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAccessToken();
  if (token && !isPublicPath(options.path)) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const requestInit: RequestInit = {
    method: options.method,
    headers,
    credentials: "include",
    ...(options.signal ? { signal: options.signal } : {}),
    ...(hasBody ? { body: JSON.stringify(options.body) } : {}),
  };

  const response = await fetch(`${apiBaseUrl}${options.path}`, requestInit);

  const payload = await parsePayload(response);

  if (response.status === 401 && !options.retried && !isPublicPath(options.path)) {
    await refreshAccessToken();
    return apiRequest<TResponse, TBody>({ ...options, retried: true });
  }

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | null;
    throw new Error(errorPayload?.error?.message ?? `Request failed with status ${response.status}`);
  }

  return payload as TResponse;
}

export function apiGet<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse> {
  return apiRequest<TResponse>({ method: "GET", path, ...(signal ? { signal } : {}) });
}

export function apiPost<TResponse, TBody extends Record<string, unknown> = Record<string, never>>(path: string, body?: TBody, signal?: AbortSignal): Promise<TResponse> {
  return apiRequest<TResponse, TBody | undefined>({
    method: "POST",
    path,
    ...(typeof body !== "undefined" ? { body } : {}),
    ...(signal ? { signal } : {}),
  });
}

export function apiPut<TResponse, TBody extends Record<string, unknown>>(path: string, body: TBody, signal?: AbortSignal): Promise<TResponse> {
  return apiRequest<TResponse, TBody>({ method: "PUT", path, body, ...(signal ? { signal } : {}) });
}

export function apiPatch<TResponse, TBody extends Record<string, unknown>>(path: string, body: TBody, signal?: AbortSignal): Promise<TResponse> {
  return apiRequest<TResponse, TBody>({ method: "PATCH", path, body, ...(signal ? { signal } : {}) });
}

export function apiDelete<TResponse>(path: string, signal?: AbortSignal): Promise<TResponse> {
  return apiRequest<TResponse>({ method: "DELETE", path, ...(signal ? { signal } : {}) });
}
