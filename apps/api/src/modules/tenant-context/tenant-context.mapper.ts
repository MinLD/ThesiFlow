import type { Organization, TenantMembership } from "../../generated/prisma/client";

export function toTenantContextDto(context: TenantMembership & { organization: Organization }) {
  return {
    accountId: context.accountId,
    organizationId: context.organizationId,
    membershipId: context.id,
    organization: {
      id: context.organization.id,
      name: context.organization.name,
      slug: context.organization.slug,
    },
    membership: {
      id: context.id,
      status: context.status,
      source: context.source,
    },
  };
}
