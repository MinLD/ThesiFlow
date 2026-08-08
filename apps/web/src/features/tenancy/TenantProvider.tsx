"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthProvider";
import { listMyMemberships, switchTenantContext } from "./tenancy.api";
import type { MembershipListItem, TenantContext } from "./types";

type TenantState = "loading" | "no-tenant" | "selecting" | "active" | "error";

const EMPTY_MEMBERSHIPS: MembershipListItem[] = [];

type TenantContextValue = {
  state: TenantState;
  memberships: MembershipListItem[];
  activeContext: TenantContext | null;
  error: string | null;
  switchingOrganizationId: string | null;
  refreshMemberships(): Promise<void>;
  switchToOrganization(organizationId: string): Promise<void>;
  clearTenantContext(): void;
};

const TenantContextObject = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [activeContext, setActiveContext] = useState<TenantContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [switchingOrganizationId, setSwitchingOrganizationId] = useState<string | null>(null);
  const accountId = auth.state.status === "authenticated" ? auth.state.account.id : null;

  const membershipsQuery = useQuery({
    queryKey: ["tenant-memberships", accountId],
    queryFn: ({ signal }) => listMyMemberships(signal).then((response) => response.data.memberships),
    enabled: Boolean(accountId),
  });

  useEffect(() => {
    if (!accountId) {
      queryClient.removeQueries({ queryKey: ["tenant"] });
      queryClient.removeQueries({ queryKey: ["tenant-memberships"] });
    }
  }, [accountId, queryClient]);

  const memberships = membershipsQuery.data ?? EMPTY_MEMBERSHIPS;
  const currentActiveContext = activeContext?.accountId === accountId ? activeContext : null;
  const currentError = accountId ? error : null;
  const currentSwitchingOrganizationId = accountId ? switchingOrganizationId : null;
  const state: TenantState = membershipsQuery.isLoading
    ? "loading"
    : currentSwitchingOrganizationId
      ? "selecting"
      : currentError
        ? "error"
        : currentActiveContext
          ? "active"
          : "no-tenant";

  const value = useMemo<TenantContextValue>(() => ({
    state,
    memberships,
    activeContext: currentActiveContext,
    error: currentError,
    switchingOrganizationId: currentSwitchingOrganizationId,
    async refreshMemberships() {
      await membershipsQuery.refetch();
    },
    async switchToOrganization(organizationId) {
      setError(null);
      setSwitchingOrganizationId(organizationId);
      const previousOrganizationId = currentActiveContext?.organizationId;
      try {
        const response = await switchTenantContext({ organizationId });
        if (previousOrganizationId && previousOrganizationId !== response.data.tenantContext.organizationId) {
          queryClient.removeQueries({ queryKey: ["tenant", previousOrganizationId] });
        }
        setActiveContext(response.data.tenantContext);
        await queryClient.invalidateQueries({ queryKey: ["tenant-memberships", accountId] });
      } catch (switchError) {
        setError(switchError instanceof Error ? switchError.message : "Bạn không thể truy cập tổ chức này.");
      } finally {
        setSwitchingOrganizationId(null);
      }
    },
    clearTenantContext() {
      setActiveContext(null);
      setError(null);
      setSwitchingOrganizationId(null);
    },
  }), [accountId, currentActiveContext, currentError, currentSwitchingOrganizationId, memberships, membershipsQuery, queryClient, state]);

  return <TenantContextObject.Provider value={value}>{children}</TenantContextObject.Provider>;
}

export function useTenant() {
  const value = useContext(TenantContextObject);
  if (!value) {
    throw new Error("useTenant must be used inside TenantProvider");
  }

  return value;
}
