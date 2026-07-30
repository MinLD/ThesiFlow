import { prisma } from "../../database/prisma";

export function findUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
      tenant: { status: "active" },
    },
    include: {
      tenant: true,
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
