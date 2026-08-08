import crypto from "node:crypto";
import { requireActiveAccount } from "../../common/auth/requireActiveAccount";
import { AppError } from "../../common/errors/AppError";
import { toInvitationDto, toMembershipDto, toOrganizationDto } from "./organization.mapper";
import {
  acceptPendingMembershipInvitation,
  activateOrganizationForCreator,
  createMembershipInvitation,
  createOrganizationWithCreatorMembership,
  findMembershipInvitationByTokenHash,
  findOrganizationById,
  hasActiveMembership,
  isUniqueError,
  markInvitationExpired,
} from "./organization.repository";
import type { OrganizationResult } from "./organization.repository";
import type { AcceptInvitationInput, CreateInvitationInput, CreateOrganizationInput } from "./organization.schemas";

const invitationTtlMs = 7 * 24 * 60 * 60 * 1000;

async function createOrganization(authorization: string | undefined, input: CreateOrganizationInput) {
  const account = await requireActiveAccount(authorization);

  try {
    return mapResult(
      await createOrganizationWithCreatorMembership({
        accountId: account.id,
        name: input.name,
        slug: input.slug,
      }),
    );
  } catch (error) {
    if (isUniqueError(error)) {
      throw new AppError(409, "ORGANIZATION_SLUG_EXISTS", "Organization slug already exists");
    }
    throw error;
  }
}

async function activateOrganization(authorization: string | undefined, organizationId: string) {
  const account = await requireActiveAccount(authorization);
  const result = await activateOrganizationForCreator({ accountId: account.id, organizationId });

  if (!result) {
    throw new AppError(404, "ORGANIZATION_NOT_FOUND", "Organization not found");
  }
  if (!result.membership) {
    if (result.organization.status === "active") {
      throw new AppError(409, "ORGANIZATION_ALREADY_ACTIVE", "Organization already active");
    }
    throw new AppError(403, "ORGANIZATION_ACTIVATION_FORBIDDEN", "Organization activation forbidden");
  }

  return mapResult(result);
}

async function createInvitation(authorization: string | undefined, organizationId: string, input: CreateInvitationInput) {
  const account = await requireActiveAccount(authorization);
  const organization = await findOrganizationById(organizationId);
  if (!organization) {
    throw new AppError(404, "ORGANIZATION_NOT_FOUND", "Organization not found");
  }
  if (!(await hasActiveMembership({ organizationId, accountId: account.id }))) {
    throw new AppError(403, "ORGANIZATION_MEMBERSHIP_REQUIRED", "Organization membership required");
  }

  const invitationToken = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + invitationTtlMs);

  try {
    const invitation = await createMembershipInvitation({
      organizationId,
      email: input.email,
      tokenHash: hashInvitationToken(invitationToken),
      invitedByAccountId: account.id,
      expiresAt,
    });
    return { invitation: toInvitationDto(invitation), invitationToken };
  } catch (error) {
    if (isUniqueError(error)) {
      throw new AppError(409, "MEMBERSHIP_INVITATION_ALREADY_PENDING", "Membership invitation already pending");
    }
    throw error;
  }
}

async function acceptInvitation(authorization: string | undefined, input: AcceptInvitationInput) {
  const account = await requireActiveAccount(authorization);
  const invitation = await findMembershipInvitationByTokenHash(hashInvitationToken(input.token));
  if (!invitation) {
    throw new AppError(404, "MEMBERSHIP_INVITATION_NOT_FOUND", "Membership invitation not found");
  }
  if (invitation.status !== "pending") {
    throw new AppError(409, "MEMBERSHIP_INVITATION_NOT_PENDING", "Membership invitation is not pending");
  }
  if (invitation.expiresAt.getTime() <= Date.now()) {
    await markInvitationExpired(invitation.id);
    throw new AppError(410, "MEMBERSHIP_INVITATION_EXPIRED", "Membership invitation expired");
  }
  if (account.email !== invitation.email) {
    throw new AppError(403, "MEMBERSHIP_INVITATION_RECIPIENT_MISMATCH", "Membership invitation recipient mismatch");
  }

  try {
    const accepted = await acceptPendingMembershipInvitation({
      invitationId: invitation.id,
      organizationId: invitation.organizationId,
      accountId: account.id,
      now: new Date(),
    });
    return {
      invitation: toInvitationDto(accepted.invitation),
      membership: toMembershipDto(accepted.membership),
    };
  } catch (error) {
    if (isUniqueError(error)) {
      throw new AppError(409, "TENANT_MEMBERSHIP_ALREADY_EXISTS", "Tenant membership already exists");
    }
    throw error;
  }
}

function hashInvitationToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function mapResult(result: OrganizationResult) {
  return {
    organization: toOrganizationDto(result.organization),
    membership: toMembershipDto(result.membership),
  };
}

export { acceptInvitation, activateOrganization, createInvitation, createOrganization };
