import { requireActiveAccount } from "../../common/auth/requireActiveAccount";
import { toMembershipListItemDto } from "./me.mapper";
import { listMembershipsForAccount } from "./me.repository";

export async function listMyMemberships(authorization: string | undefined) {
  const account = await requireActiveAccount(authorization);
  const memberships = await listMembershipsForAccount(account.id);

  return { memberships: memberships.map(toMembershipListItemDto) };
}
