import { afterEach, describe, expect, it, vi } from "vitest";
import { listMyMemberships, switchTenantContext } from "./tenancy.api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("tenancy API client", () => {
  it("calls canonical membership and tenant switch endpoints", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, data: { memberships: [], tenantContext: null }, meta: {} }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await listMyMemberships();
    await switchTenantContext({ organizationId: "00000000-0000-4000-8000-000000000001" });

    expect(fetchMock).toHaveBeenNthCalledWith(1, "http://localhost:4000/api/v1/me/memberships", expect.objectContaining({ method: "GET" }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, "http://localhost:4000/api/v1/tenant-context/switch", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ organizationId: "00000000-0000-4000-8000-000000000001" }),
    }));
  });
});
