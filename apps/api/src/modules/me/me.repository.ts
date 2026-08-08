import { prisma } from "../../database/prisma";

export function listMembershipsForAccount(accountId: string) {
  return prisma.tenantMembership.findMany({
    where: { accountId },
    include: { organization: true },
    orderBy: [{ organization: { name: "asc" } }, { createdAt: "asc" }],
  });
}
