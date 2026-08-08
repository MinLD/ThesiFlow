export type OrganizationStatus = "active" | "disabled" | "deleted";
export type MembershipStatus = "invited" | "active" | "inactive";
export type MembershipSource = "invitation" | "import" | "provisioning";

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
};

export type MembershipListItem = {
  id: string;
  status: MembershipStatus;
  source: MembershipSource;
  canSwitch: boolean;
  organization: OrganizationSummary;
};

export type TenantContext = {
  accountId: string;
  organizationId: string;
  membershipId: string;
  organization: Pick<OrganizationSummary, "id" | "name" | "slug">;
  membership: {
    id: string;
    status: "active";
    source: MembershipSource;
  };
};

export type OrganizationCreateResult = {
  organization: OrganizationSummary & { verifiedAt: string | null };
  membership: {
    id: string;
    accountId: string;
    organizationId: string;
    status: MembershipStatus;
    source: MembershipSource;
    activatedAt?: string;
  };
};

export type InvitationResult = {
  invitation: {
    id: string;
    organizationId: string;
    email: string;
    status: string;
    expiresAt?: string;
    acceptedAt?: string;
  };
  invitationToken?: string;
};
