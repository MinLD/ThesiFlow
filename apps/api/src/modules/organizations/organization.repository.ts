import { prisma } from "../../database/prisma";
import type { MembershipInvitation, Organization, Prisma, TenantMembership } from "../../generated/prisma/client";

export type OrganizationResult = {
  organization: Organization;
  membership: TenantMembership;
};

export type ActivationResult = OrganizationResult | {
  organization: Organization;
  membership: null;
} | null;

export type InvitationAcceptanceResult = {
  invitation: MembershipInvitation;
  membership: TenantMembership;
};

type DbClient = Prisma.TransactionClient;

export function createOrganizationWithCreatorMembership(input: {
  name: string;
  slug: string;
  accountId: string;
}): Promise<OrganizationResult> {
  return prisma.$transaction(async (db) => {
    const organization = await db.organization.create({
      data: {
        name: input.name,
        slug: input.slug,
        status: "disabled",
      },
    });
    const membership = await db.tenantMembership.create({
      data: {
        organizationId: organization.id,
        accountId: input.accountId,
        status: "inactive",
        source: "provisioning",
      },
    });

    return { organization, membership };
  });
}

export function createMembershipInvitation(input: {
  organizationId: string;
  email: string;
  tokenHash: string;
  invitedByAccountId: string;
  expiresAt: Date;
}) {
  return prisma.membershipInvitation.create({
    data: {
      organizationId: input.organizationId,
      email: input.email,
      tokenHash: input.tokenHash,
      invitedByAccountId: input.invitedByAccountId,
      expiresAt: input.expiresAt,
    },
  });
}

export function findMembershipInvitationByTokenHash(tokenHash: string) {
  return prisma.membershipInvitation.findUnique({ where: { tokenHash } });
}

export function findOrganizationById(organizationId: string) {
  return prisma.organization.findUnique({ where: { id: organizationId } });
}

export function hasActiveMembership(input: { organizationId: string; accountId: string }) {
  return prisma.tenantMembership.findFirst({
    where: {
      organizationId: input.organizationId,
      accountId: input.accountId,
      status: "active",
    },
    select: { id: true },
  });
}

export function acceptPendingMembershipInvitation(input: {
  invitationId: string;
  organizationId: string;
  accountId: string;
  now: Date;
}): Promise<InvitationAcceptanceResult> {
  return prisma.$transaction(async (db) => {
    const invitation = await db.membershipInvitation.update({
      where: { id: input.invitationId },
      data: { status: "accepted", acceptedAt: input.now },
    });
    const membership = await db.tenantMembership.create({
      data: {
        organizationId: input.organizationId,
        accountId: input.accountId,
        status: "active",
        source: "invitation",
        activatedAt: input.now,
      },
    });

    return { invitation, membership };
  });
}

export function markInvitationExpired(invitationId: string) {
  return prisma.membershipInvitation.update({
    where: { id: invitationId },
    data: { status: "expired" },
  });
}

export async function activateOrganizationForCreator(input: {
  organizationId: string;
  accountId: string;
}): Promise<ActivationResult> {
  return prisma.$transaction(async (db) => {
    const organization = await db.organization.findUnique({
      where: { id: input.organizationId },
    });
    if (!organization) {
      return null;
    }

    const membership = await findCreatorMembership(db, input);
    if (!membership) {
      return { organization, membership: null };
    }

    const now = new Date();
    const activatedOrganization = await db.organization.update({
      where: { id: organization.id },
      data: { status: "active", verifiedAt: now },
    });
    const activatedMembership = await db.tenantMembership.update({
      where: { id: membership.id },
      data: { status: "active", activatedAt: now, deactivatedAt: null },
    });

    return { organization: activatedOrganization, membership: activatedMembership };
  });
}

function findCreatorMembership(db: DbClient, input: { organizationId: string; accountId: string }) {
  return db.tenantMembership.findFirst({
    where: {
      organizationId: input.organizationId,
      accountId: input.accountId,
      source: "provisioning",
      status: "inactive",
    },
  });
}

export function isUniqueError(error: unknown): boolean {
  const knownError = error as { code?: string; meta?: { target?: string[] } };
  return knownError.code === "P2002";
}
