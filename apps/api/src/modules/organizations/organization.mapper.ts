import type { MembershipInvitation, Organization, TenantMembership } from "../../generated/prisma/client";

export function toOrganizationDto(organization: Organization) {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    status: organization.status,
    verifiedAt: organization.verifiedAt?.toISOString() ?? null,
  };
}

export function toMembershipDto(membership: TenantMembership) {
  return {
    id: membership.id,
    accountId: membership.accountId,
    organizationId: membership.organizationId,
    status: membership.status,
    source: membership.source,
    ...(membership.activatedAt ? { activatedAt: membership.activatedAt.toISOString() } : {}),
  };
}

export function toInvitationDto(invitation: MembershipInvitation) {
  return {
    id: invitation.id,
    organizationId: invitation.organizationId,
    email: invitation.email,
    status: invitation.status,
    ...(invitation.expiresAt ? { expiresAt: invitation.expiresAt.toISOString() } : {}),
    ...(invitation.acceptedAt ? { acceptedAt: invitation.acceptedAt.toISOString() } : {}),
  };
}
