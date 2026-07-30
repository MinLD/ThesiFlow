import { prisma } from "../../database/prisma";

export async function getFoundationSystemInfo() {
  return prisma.systemInfo.findUnique({
    where: { key: "foundation_phase" }
  });
}

export async function getActiveSystemConfiguration(key: string, client = prisma) {
  return client.systemConfiguration.findFirst({
    where: { key, active: true },
    select: { key: true, value: true, version: true, updatedAt: true }
  });
}
