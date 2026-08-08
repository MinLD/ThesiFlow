import { requireActiveAccount } from "../../common/auth/requireActiveAccount";
import { AppError } from "../../common/errors/AppError";
import { toTenantContextDto } from "./tenant-context.mapper";
import { findActiveTenantContext } from "./tenant-context.repository";
import type { SwitchTenantContextInput } from "./tenant-context.schemas";

export async function switchTenantContext(authorization: string | undefined, input: SwitchTenantContextInput) {
  const account = await requireActiveAccount(authorization);
  const context = await findActiveTenantContext({ accountId: account.id, organizationId: input.organizationId });

  if (!context) {
    throw new AppError(403, "MEMBERSHIP_INACTIVE", "Tenant context is not available");
  }

  return { tenantContext: toTenantContextDto(context) };
}
