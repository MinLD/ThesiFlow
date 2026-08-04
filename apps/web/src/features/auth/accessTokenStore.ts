"use client";

let accessToken: string | null = null;

function getAccessToken(): string | null {
  return accessToken;
}

function setAccessToken(token: string | null): void {
  accessToken = token;
}

function clearAccessToken(): void {
  accessToken = null;
}

export { clearAccessToken, getAccessToken, setAccessToken };
