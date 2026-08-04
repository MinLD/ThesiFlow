"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearAccessToken, setAccessToken } from "./accessTokenStore";
import { forgotPassword as requestPasswordReset, loginAccount, logoutAccount, refreshSession, registerAccount, type AuthAccount } from "./auth.api";

type AuthState =
  | { status: "loading"; account: null }
  | { status: "authenticated"; account: AuthAccount }
  | { status: "unauthenticated"; account: null };

type AuthContextValue = {
  state: AuthState;
  login(input: { email: string; password: string }): Promise<void>;
  register(input: { email: string; fullName: string; password: string }): Promise<void>;
  forgotPassword(input: { email: string }): Promise<void>;
  logout(): Promise<void>;
  clearAuth(): void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading", account: null });

  function clearAuth() {
    clearAccessToken();
    setState({ status: "unauthenticated", account: null });
  }

  useEffect(() => {
    let active = true;

    refreshSession()
      .then((response) => {
        if (!active) {
          return;
        }
        setAccessToken(response.data.accessToken);
        setState({ status: "authenticated", account: response.data.account });
      })
      .catch(() => {
        if (!active) {
          return;
        }
        clearAuth();
      });

    function onAuthExpired() {
      clearAuth();
    }

    window.addEventListener("thesiflow:auth-expired", onAuthExpired);
    return () => {
      active = false;
      window.removeEventListener("thesiflow:auth-expired", onAuthExpired);
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    state,
    async login(input) {
      const response = await loginAccount(input);
      setAccessToken(response.data.accessToken);
      setState({ status: "authenticated", account: response.data.account });
    },
    async register(input) {
      await registerAccount(input);
    },
    async forgotPassword(input) {
      await requestPasswordReset(input);
    },
    async logout() {
      await logoutAccount().catch(() => undefined);
      clearAuth();
    },
    clearAuth,
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
