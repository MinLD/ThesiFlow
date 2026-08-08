import request from "supertest";
import { afterAll, afterEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/database/prisma";

const app = createApp();
const password = "correct horse battery staple";
const emails = new Set<string>();
const organizationSlugs = new Set<string>();

function uniqueEmail(prefix = "p3-invite") {
  const email = `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.test`;
  emails.add(email);
  return email;
}

function uniqueSlug(prefix = "p3-invite-org") {
  const slug = `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  organizationSlugs.add(slug);
  return slug;
}

async function loginActiveAccount(email = uniqueEmail()) {
  const register = await request(app)
    .post("/auth/register")
    .send({ email, fullName: "Invitation Actor", password });

  await request(app)
    .post("/auth/verify-email")
    .send({ token: register.body.data.verificationToken })
    .expect(200);

  const login = await request(app).post("/auth/login").send({ email, password });
  expect(login.status).toBe(200);
  return {
    accountId: login.body.data.account.id as string,
    accessToken: login.body.data.accessToken as string,
    email,
  };
}

async function createActiveOrganization(accessToken: string) {
  const slug = uniqueSlug();
  const create = await request(app)
    .post("/organizations")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ name: "Invitation Lifecycle University", slug })
    .expect(201);

  await request(app)
    .post(`/organizations/${create.body.data.organization.id}/activate`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send()
    .expect(200);

  return create.body.data.organization.id as string;
}

async function inviteMember(organizationId: string, accessToken: string, email = uniqueEmail("invitee")) {
  const response = await request(app)
    .post(`/organizations/${organizationId}/invitations`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ email });

  return { response, email };
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

describe("Phase 3 membership invitation lifecycle", () => {
  it("creates pending invitation with normalized recipient and no token hash leak", async () => {
    const inviter = await loginActiveAccount();
    const organizationId = await createActiveOrganization(inviter.accessToken);
    const recipientEmail = uniqueEmail("invitee").toUpperCase();

    const { response } = await inviteMember(organizationId, inviter.accessToken, recipientEmail);

    expect(response.status).toBe(201);
    expect(response.body.data.invitation).toEqual({
      id: expect.any(String),
      organizationId,
      email: recipientEmail.toLowerCase(),
      status: "pending",
      expiresAt: expect.any(String),
    });
    expect(response.body.data.invitationToken).toEqual(expect.any(String));
    expect(JSON.stringify(response.body)).not.toContain("tokenHash");
  });

  it("accepts invitation only by matching account email and creates active membership", async () => {
    const inviter = await loginActiveAccount();
    const organizationId = await createActiveOrganization(inviter.accessToken);
    const invitee = await loginActiveAccount(uniqueEmail("invitee"));
    const { response } = await inviteMember(organizationId, inviter.accessToken, invitee.email);

    expect(response.status).toBe(201);

    const accept = await request(app)
      .post("/membership-invitations/accept")
      .set("Authorization", `Bearer ${invitee.accessToken}`)
      .send({ token: response.body.data.invitationToken });

    expect(accept.status).toBe(200);
    expect(accept.body.data.invitation.status).toBe("accepted");
    expect(accept.body.data.membership).toEqual({
      id: expect.any(String),
      accountId: invitee.accountId,
      organizationId,
      status: "active",
      source: "invitation",
      activatedAt: expect.any(String),
    });
  });

  it("rejects invitation acceptance by wrong account", async () => {
    const inviter = await loginActiveAccount();
    const organizationId = await createActiveOrganization(inviter.accessToken);
    const intendedInviteeEmail = uniqueEmail("intended");
    const wrongAccount = await loginActiveAccount(uniqueEmail("wrong"));
    const { response } = await inviteMember(organizationId, inviter.accessToken, intendedInviteeEmail);

    expect(response.status).toBe(201);

    const accept = await request(app)
      .post("/membership-invitations/accept")
      .set("Authorization", `Bearer ${wrongAccount.accessToken}`)
      .send({ token: response.body.data.invitationToken });

    expect(accept.status).toBe(403);
    expect(accept.body.error.code).toBe("MEMBERSHIP_INVITATION_RECIPIENT_MISMATCH");
  });

  it("rejects replay after invitation has already been accepted", async () => {
    const inviter = await loginActiveAccount();
    const organizationId = await createActiveOrganization(inviter.accessToken);
    const invitee = await loginActiveAccount(uniqueEmail("replay"));
    const { response } = await inviteMember(organizationId, inviter.accessToken, invitee.email);

    expect(response.status).toBe(201);
    const token = response.body.data.invitationToken as string;

    await request(app)
      .post("/membership-invitations/accept")
      .set("Authorization", `Bearer ${invitee.accessToken}`)
      .send({ token })
      .expect(200);

    const replay = await request(app)
      .post("/membership-invitations/accept")
      .set("Authorization", `Bearer ${invitee.accessToken}`)
      .send({ token });

    expect(replay.status).toBe(409);
    expect(replay.body.error.code).toBe("MEMBERSHIP_INVITATION_NOT_PENDING");
  });
});
