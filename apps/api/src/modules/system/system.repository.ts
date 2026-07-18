import { prisma } from "../../database/prisma";

export async function getFoundationSystemInfo() {
  return prisma.systemInfo.findUnique({
    where: { key: "foundation_phase" }
  });
}
