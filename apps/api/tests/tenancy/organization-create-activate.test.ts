import request from "supertest";
import { afterAll, afterEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/database/prisma";

const app = createApp();
const password = "correct horse battery staple";
const emails = new Set<string>();
const organizationSlugs = new Set<string>();

function uniqueEmail(prefix = "p3-org") {
  const email = `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.test`;
  emails.add(email);
  return email;
}

function uniqueSlug(prefix = "p3-org") {
  const slug = `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  organizationSlugs.add(slug);
  return slug;
}

async function loginActiveAccount() {
  const email = uniqueEmail();
  const register = await request(app)
    .post("/auth/register")
    .send({ email, fullName: "Organization Creator", password });

  await request(app)
    .post("/auth/verify-email")
    .send({ token: register.body.data.verificationToken })
    .expect(200);

  const login = await request(app).post("/auth/login").send({ email, password });
  expect(login.status).toBe(200);
  return {
    accountId: login.body.data.account.id as string,
    accessToken: login.body.data.accessToken as string,
  };
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

describe("Phase 3 organization create/activate APIs", () => {
  it("creates disabled organization and inactive creator membership", async () => {
    const actor = await loginActiveAccount();
    const slug = uniqueSlug();

    const response = await request(app)
      .post("/organizations")
      .set("Authorization", `Bearer ${actor.accessToken}`)
      .send({ name: "APLP Demo Faculty", slug });

    expect(response.status).toBe(201);
    expect(response.body.data.organization).toEqual({
      id: expect.any(String),
      name: "APLP Demo Faculty",
      slug,
      status: "disabled",
      verifiedAt: null,
    });
    expect(response.body.data.membership).toEqual({
      id: expect.any(String),
      accountId: actor.accountId,
      organizationId: response.body.data.organization.id,
      status: "inactive",
      source: "provisioning",
    });
    expect(JSON.stringify(response.body)).not.toContain("tokenHash");
  });

  it("activates organization and creator membership", async () => {
    const actor = await loginActiveAccount();
    const slug = uniqueSlug();
    const create = await request(app)
      .post("/organizations")
      .set("Authorization", `Bearer ${actor.accessToken}`)
      .send({ name: "Activation University", slug })
      .expect(201);

    const activate = await request(app)
      .post(`/organizations/${create.body.data.organization.id}/activate`)
      .set("Authorization", `Bearer ${actor.accessToken}`)
      .send();

    expect(activate.status).toBe(200);
    expect(activate.body.data.organization.status).toBe("active");
    expect(activate.body.data.organization.verifiedAt).toEqual(expect.any(String));
    expect(activate.body.data.membership.status).toBe("active");
    expect(activate.body.data.membership.activatedAt).toEqual(expect.any(String));
  });

  it("rejects unauthenticated create and activate requests", async () => {
    const actor = await loginActiveAccount();
    const slug = uniqueSlug();
    const create = await request(app)
      .post("/organizations")
      .set("Authorization", `Bearer ${actor.accessToken}`)
      .send({ name: "Auth Required University", slug })
      .expect(201);

    await request(app)
      .post("/organizations")
      .send({ name: "No Auth University", slug: uniqueSlug("no-auth") })
      .expect(401);

    await request(app)
      .post(`/organizations/${create.body.data.organization.id}/activate`)
      .send()
      .expect(401);
  });

  it("rejects duplicate and invalid slugs", async () => {
    const actor = await loginActiveAccount();
    const slug = uniqueSlug();
    await request(app)
      .post("/organizations")
      .set("Authorization", `Bearer ${actor.accessToken}`)
      .send({ name: "Unique University", slug })
      .expect(201);

    const duplicate = await request(app)
      .post("/organizations")
      .set("Authorization", `Bearer ${actor.accessToken}`)
      .send({ name: "Duplicate University", slug });
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.code).toBe("ORGANIZATION_SLUG_EXISTS");

    const invalid = await request(app)
      .post("/organizations")
      .set("Authorization", `Bearer ${actor.accessToken}`)
      .send({ name: "Invalid Slug University", slug: "Invalid Slug" });
    expect(invalid.status).toBe(400);
  });
});
