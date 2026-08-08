import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const apiRoot = join(__dirname, "../..");

function read(path: string) {
  return readFileSync(join(apiRoot, path), "utf8");
}

describe("Phase 3 runtime reconciliation boundary", () => {
  it("keeps runtime source free from legacy Tenant prisma access", () => {
    const files = [
      "src/app.ts",
      "src/modules/auth/auth.controller.ts",
      "src/modules/auth/auth.repository.ts",
      "src/modules/auth/auth.service.ts",
      "prisma/seed.ts",
    ];

    for (const file of files) {
      const source = read(file);

      expect(source, file).not.toMatch(/prisma\.tenant\b/);
      expect(source, file).not.toMatch(/tenantId\b/);
      expect(source, file).not.toMatch(/tenant_id/);
    }
  });

  it("exposes only Phase 3 organization, invitation, and accept routes so far", () => {
    const appSource = read("src/app.ts");
    const routeSource = read("src/modules/organizations/organization.routes.ts");

    expect(appSource).toContain('/organizations');
    expect(appSource).toContain('/membership-invitations');
    expect(routeSource).toContain('/:organizationId/activate');
    expect(routeSource).toContain('/:organizationId/invitations');
    expect(routeSource).toContain('/accept');
    expect(routeSource).not.toContain('switch');
  });
});
