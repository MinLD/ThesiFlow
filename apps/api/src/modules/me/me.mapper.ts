import type { Organization, TenantMembership } from "../../generated/prisma/client";

export function toMembershipListItemDto(membership: TenantMembership & { organization: Organization }) {
  const canSwitch = membership.status === "active" && membership.organization.status === "active" && !membership.organization.deletedAt;

  return {
    id: membership.id,
    status: membership.status,
    source: membership.source,
    canSwitch,
    organization: {
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      status: membership.organization.status,
    },
  };
}
