import { randomUUID } from "node:crypto";
import request from "supertest";
import { afterAll, afterEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/database/prisma";
import { signAccessToken } from "../../src/common/auth/token";

const app = createApp();
const emails = new Set<string>();
const organizationSlugs = new Set<string>();

function uniqueEmail(prefix = "tenant-context") {
  const email = `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.test`;
  emails.add(email);
  return email;
}

function uniqueSlug(prefix = "tenant-context-org") {
  const slug = `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  organizationSlugs.add(slug);
  return slug;
}

async function loginActiveAccount(email = uniqueEmail()) {
  const account = await prisma.account.create({
    data: {
      email,
      fullName: "Tenant Context User",
      status: "active",
      emailVerifiedAt: new Date(),
    },
  });

  return {
    accountId: account.id,
    accessToken: signAccessToken({ sub: account.id, sessionId: randomUUID(), email }),
  };
}

async function createOrganization(input: { status?: "active" | "disabled" | "deleted" } = {}) {
  const slug = uniqueSlug();
  return prisma.organization.create({
    data: {
      name: `Tenant Context ${slug}`,
      slug,
      status: input.status ?? "active",
      verifiedAt: input.status === "disabled" ? null : new Date(),
    },
  });
}

async function createMembership(input: {
  accountId: string;
  organizationId: string;
  status?: "invited" | "active" | "inactive";
  source?: "invitation" | "import" | "provisioning";
}) {
  return prisma.tenantMembership.create({
    data: {
      accountId: input.accountId,
      organizationId: input.organizationId,
      status: input.status ?? "active",
      source: input.source ?? "provisioning",
      activatedAt: input.status === "invited" || input.status === "inactive" ? null : new Date(),
    },
  });
}

async function switchTenant(accessToken: string, body: Record<string, unknown>) {
  return request(app)
    .post("/api/v1/tenant-context/switch")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(body);
}

afterEach(async () => {
  if (organizationSlugs.size > 0) {
    const organizations = await prisma.organization.findMany({
      where: { slug: { in: [...organizationSlugs] } },
      select: { id: true },
    });
    const organizationIds = organizations.map((organization) => organization.id);

    await prisma.membershipInvitation.deleteMany({ where: { organizationId: { in: organizationIds } } });
    await prisma.tenantMembership.deleteMany({ where: { organizationId: { in: organizationIds } } });
    await prisma.organization.deleteMany({ where: { id: { in: organizationIds } } });
  }

  if (emails.size > 0) {
    await prisma.account.deleteMany({ where: { email: { in: [...emails] } } });
  }

  organizationSlugs.clear();
  emails.clear();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("P3-004 tenant context switch API", () => {

  it("lists only the authenticated account memberships for tenant selection", async () => {
    const firstUser = await loginActiveAccount(uniqueEmail("list-a"));
    const secondUser = await loginActiveAccount(uniqueEmail("list-b"));
    const activeOrganization = await createOrganization();
    const disabledOrganization = await createOrganization({ status: "disabled" });
    const otherOrganization = await createOrganization();
    const activeMembership = await createMembership({ accountId: firstUser.accountId, organizationId: activeOrganization.id });
    const inactiveMembership = await createMembership({
      accountId: firstUser.accountId,
      organizationId: disabledOrganization.id,
      status: "inactive",
    });
    await createMembership({ accountId: secondUser.accountId, organizationId: otherOrganization.id });

    const response = await request(app)
      .get("/api/v1/me/memberships")
      .set("Authorization", `Bearer ${firstUser.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.memberships).toHaveLength(2);
    expect(response.body.data.memberships).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: activeMembership.id,
        status: "active",
        canSwitch: true,
        organization: expect.objectContaining({ id: activeOrganization.id, status: "active" }),
      }),
      expect.objectContaining({
        id: inactiveMembership.id,
        status: "inactive",
        canSwitch: false,
        organization: expect.objectContaining({ id: disabledOrganization.id, status: "disabled" }),
      }),
    ]));
    expect(JSON.stringify(response.body)).not.toContain(otherOrganization.id);
  });

  it("switches to an active organization through active membership", async () => {
    const user = await loginActiveAccount();
    const organization = await createOrganization();
    const membership = await createMembership({ accountId: user.accountId, organizationId: organization.id });

    const response = await switchTenant(user.accessToken, { organizationId: organization.id });

    expect(response.status).toBe(200);
    expect(response.body.data.tenantContext).toEqual({
      accountId: user.accountId,
      organizationId: organization.id,
      membershipId: membership.id,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
      membership: {
        id: membership.id,
        status: "active",
        source: "provisioning",
      },
    });
    expect(JSON.stringify(response.body)).not.toContain("deletedAt");
  });

  it("switches correctly between multiple organizations", async () => {
    const user = await loginActiveAccount();
    const firstOrganization = await createOrganization();
    const secondOrganization = await createOrganization();
    const firstMembership = await createMembership({
      accountId: user.accountId,
      organizationId: firstOrganization.id,
      source: "provisioning",
    });
    const secondMembership = await createMembership({
      accountId: user.accountId,
      organizationId: secondOrganization.id,
      source: "invitation",
    });

    const firstSwitch = await switchTenant(user.accessToken, { organizationId: firstOrganization.id });
    const secondSwitch = await switchTenant(user.accessToken, { organizationId: secondOrganization.id });

    expect(firstSwitch.status).toBe(200);
    expect(firstSwitch.body.data.tenantContext).toMatchObject({
      organizationId: firstOrganization.id,
      membershipId: firstMembership.id,
      membership: { source: "provisioning" },
    });
    expect(secondSwitch.status).toBe(200);
    expect(secondSwitch.body.data.tenantContext).toMatchObject({
      organizationId: secondOrganization.id,
      membershipId: secondMembership.id,
      membership: { source: "invitation" },
    });
  });

  it("rejects organization switch when user is not a member", async () => {
    const user = await loginActiveAccount();
    const organization = await createOrganization({ status: "disabled" });

    const response = await switchTenant(user.accessToken, { organizationId: organization.id });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("MEMBERSHIP_INACTIVE");
  });

  it("rejects invited and inactive memberships", async () => {
    const user = await loginActiveAccount();
    const invitedOrganization = await createOrganization();
    const inactiveOrganization = await createOrganization();
    await createMembership({ accountId: user.accountId, organizationId: invitedOrganization.id, status: "invited" });
    await createMembership({ accountId: user.accountId, organizationId: inactiveOrganization.id, status: "inactive" });

    const invitedSwitch = await switchTenant(user.accessToken, { organizationId: invitedOrganization.id });
    const inactiveSwitch = await switchTenant(user.accessToken, { organizationId: inactiveOrganization.id });

    expect(invitedSwitch.status).toBe(403);
    expect(invitedSwitch.body.error.code).toBe("MEMBERSHIP_INACTIVE");
    expect(inactiveSwitch.status).toBe(403);
    expect(inactiveSwitch.body.error.code).toBe("MEMBERSHIP_INACTIVE");
  });

  it("rejects active membership when organization is not active", async () => {
    const user = await loginActiveAccount();
    const organization = await createOrganization({ status: "disabled" });
    await createMembership({ accountId: user.accountId, organizationId: organization.id });

    const response = await switchTenant(user.accessToken, { organizationId: organization.id });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("MEMBERSHIP_INACTIVE");
  });

  it("validates missing and malformed organization IDs", async () => {
    const user = await loginActiveAccount();

    const missing = await switchTenant(user.accessToken, {});
    const malformed = await switchTenant(user.accessToken, { organizationId: "not-a-uuid" });

    expect(missing.status).toBe(400);
    expect(missing.body.error.code).toBe("VALIDATION_ERROR");
    expect(malformed.status).toBe(400);
    expect(malformed.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("requires authentication", async () => {
    const organization = await createOrganization();

    const response = await request(app)
      .post("/api/v1/tenant-context/switch")
      .send({ organizationId: organization.id });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("AUTH_REQUIRED");
  });

  it("does not accept forged role input", async () => {
    const user = await loginActiveAccount();
    const organization = await createOrganization();
    const membership = await createMembership({ accountId: user.accountId, organizationId: organization.id });

    const response = await switchTenant(user.accessToken, { organizationId: organization.id, role: "OWNER" });

    expect(response.status).toBe(200);
    expect(response.body.data.tenantContext.membershipId).toBe(membership.id);
    expect(JSON.stringify(response.body.data.tenantContext)).not.toContain("OWNER");
  });

  it("enforces cross-tenant isolation", async () => {
    const firstUser = await loginActiveAccount(uniqueEmail("tenant-a"));
    const secondUser = await loginActiveAccount(uniqueEmail("tenant-b"));
    const firstOrganization = await createOrganization();
    const secondOrganization = await createOrganization();
    await createMembership({ accountId: firstUser.accountId, organizationId: firstOrganization.id });
    await createMembership({ accountId: secondUser.accountId, organizationId: secondOrganization.id });

    const firstToSecond = await switchTenant(firstUser.accessToken, { organizationId: secondOrganization.id });
    const secondToFirst = await switchTenant(secondUser.accessToken, { organizationId: firstOrganization.id });

    expect(firstToSecond.status).toBe(403);
    expect(firstToSecond.body.error.code).toBe("MEMBERSHIP_INACTIVE");
    expect(secondToFirst.status).toBe(403);
    expect(secondToFirst.body.error.code).toBe("MEMBERSHIP_INACTIVE");
  });
});
