import { webEnv } from "../config/env";

const apiBaseUrl = webEnv.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");

export async function apiGet<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  const payload = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `Request failed with status ${response.status}`);
  }

  return payload as TResponse;
}

export async function apiPost<TResponse, TBody extends Record<string, unknown>>(path: string, body?: TBody): Promise<TResponse> {
  const init: RequestInit = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    credentials: "include"
  };

  if (body) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, init);

  const payload = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `Request failed with status ${response.status}`);
  }

  return payload as TResponse;
}
