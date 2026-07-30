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
    key: "user:read",
    category: "identity",
    description: "Read users in allowed scope",
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
    permissionKeys: ["auth:me", "user:read", "role:assign"],
  },
  {
    key: "faculty_admin",
    name: "Faculty Admin",
    permissionKeys: ["auth:me", "user:read"],
  },
  {
    key: "department_manager",
    name: "Department Manager",
    permissionKeys: ["auth:me", "user:read"],
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
    const admin = await tx.user.upsert({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email: env.ADMIN_EMAIL.toLowerCase(),
        },
      },
      update: { passwordHash, status: "active", fullName: "Admin" },
      create: {
        tenantId: tenant.id,
        email: env.ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        fullName: "Admin",
        status: "active",
      },
    });

    const adminRole = await tx.role.findUniqueOrThrow({
      where: {
        tenantId_key_scope: {
          tenantId: tenant.id,
          key: "university_admin",
          scope: "tenant",
        },
      },
    });

    await tx.userRole.deleteMany({
      where: { tenantId: tenant.id, userId: admin.id, roleId: adminRole.id, scope: "tenant" },
    });

    await tx.userRole.create({
      data: {
        tenantId: tenant.id,
        userId: admin.id,
        roleId: adminRole.id,
        scope: "tenant",
      },
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
