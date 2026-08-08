"use client";

import { apiGet, apiPost } from "../../lib/apiClient";
import type { ApiSuccessResponse } from "../auth/auth.api";
import type { InvitationResult, MembershipListItem, OrganizationCreateResult, TenantContext } from "./types";

export function listMyMemberships(signal?: AbortSignal) {
  return apiGet<ApiSuccessResponse<{ memberships: MembershipListItem[] }>>("/api/v1/me/memberships", signal);
}

export function switchTenantContext(input: { organizationId: string }) {
  return apiPost<ApiSuccessResponse<{ tenantContext: TenantContext }>, typeof input>("/api/v1/tenant-context/switch", input);
}

export function createOrganization(input: { name: string; slug: string }) {
  return apiPost<ApiSuccessResponse<OrganizationCreateResult>, typeof input>("/organizations", input);
}

export function activateOrganization(organizationId: string) {
  return apiPost<ApiSuccessResponse<OrganizationCreateResult>, Record<string, never>>(`/organizations/${organizationId}/activate`);
}

export function createInvitation(organizationId: string, input: { email: string }) {
  return apiPost<ApiSuccessResponse<InvitationResult>, typeof input>(`/organizations/${organizationId}/invitations`, input);
}

export function acceptInvitation(input: { token: string }) {
  return apiPost<ApiSuccessResponse<InvitationResult>, typeof input>("/membership-invitations/accept", input);
}
