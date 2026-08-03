import argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { env } from "../src/config/env";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const permissions = [
  {
    key: "auth:me",
    category: "auth",
    description: "Read current user profile",
  },
  {
    key: "account:read",
    category: "identity",
    description: "Read accounts in allowed scope",
  },
  {
    key: "role:assign",
    category: "identity",
    description: "Assign roles in allowed scope",
  },
] as const;

const roles = [
  {
    key: "university_admin",
    name: "University Admin",
    permissionKeys: ["auth:me", "account:read", "role:assign"],
  },
  {
    key: "faculty_admin",
    name: "Faculty Admin",
    permissionKeys: ["auth:me", "account:read"],
  },
  {
    key: "department_manager",
    name: "Department Manager",
    permissionKeys: ["auth:me", "account:read"],
  },
  { key: "lecturer", name: "Lecturer", permissionKeys: ["auth:me"] },
  { key: "reviewer", name: "Reviewer", permissionKeys: ["auth:me"] },
  { key: "student", name: "Student", permissionKeys: ["auth:me"] },
] as const;

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.systemInfo.upsert({
      where: { key: "foundation_phase" },
      update: { value: "phase_1", status: "active" },
      create: { key: "foundation_phase", value: "phase_1", status: "active" },
    });

    await tx.systemConfiguration.upsert({
      where: { key: "foundation" },
      update: { value: { phase: 1, architecture: "modular-monolith-first" }, active: true },
      create: {
        key: "foundation",
        value: { phase: 1, architecture: "modular-monolith-first" },
        description: "Phase 1 runtime configuration marker",
      },
    });

    const tenant = await tx.tenant.upsert({
      where: { slug: "demo-university" },
      update: { name: "Demo University", status: "active" },
      create: {
        name: "Demo University",
        slug: "demo-university",
        status: "active",
        plan: "FREE",
      },
    });

    for (const permission of permissions) {
      await tx.permission.upsert({
        where: { key: permission.key },
        update: permission,
        create: permission,
      });
    }

    for (const roleSeed of roles) {
      const role = await tx.role.upsert({
        where: {
          tenantId_key_scope: {
            tenantId: tenant.id,
            key: roleSeed.key,
            scope: "tenant",
          },
        },
        update: { name: roleSeed.name },
        create: {
          tenantId: tenant.id,
          key: roleSeed.key,
          name: roleSeed.name,
          scope: "tenant",
        },
      });

      for (const permissionKey of roleSeed.permissionKeys) {
        const permission = await tx.permission.findUniqueOrThrow({
          where: { key: permissionKey },
        });
        await tx.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: { roleId: role.id, permissionId: permission.id },
        });
      }
    }

    const passwordHash = await argon2.hash(env.ADMIN_PASSWORD);
    const admin = await tx.account.upsert({
      where: { email: env.ADMIN_EMAIL.toLowerCase() },
      update: { status: "active", fullName: "Admin" },
      create: {
        email: env.ADMIN_EMAIL.toLowerCase(),
        fullName: "Admin",
        status: "active",
      },
    });

    await tx.accountCredential.upsert({
      where: { accountId: admin.id },
      update: { passwordHash, passwordUpdatedAt: new Date() },
      create: { accountId: admin.id, passwordHash },
    });
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
