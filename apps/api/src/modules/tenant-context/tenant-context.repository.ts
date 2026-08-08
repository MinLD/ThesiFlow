import { prisma } from "../../database/prisma";

export function findActiveTenantContext(input: { accountId: string; organizationId: string }) {
  return prisma.tenantMembership.findFirst({
    where: {
      accountId: input.accountId,
      organizationId: input.organizationId,
      status: "active",
      organization: {
        status: "active",
        deletedAt: null,
      },
    },
    include: {
      organization: true,
    },
  });
}
