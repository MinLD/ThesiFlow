import { z } from "zod";

export const switchTenantContextSchema = z.object({
  organizationId: z.string().uuid(),
});

export type SwitchTenantContextInput = z.infer<typeof switchTenantContextSchema>;
