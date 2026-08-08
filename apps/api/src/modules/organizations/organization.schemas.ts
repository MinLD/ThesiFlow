import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9-]{3,80}$/),
});

export const organizationParamsSchema = z.object({
  organizationId: z.string().uuid(),
});

export const createInvitationSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
