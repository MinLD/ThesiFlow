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

  it("does not expose organization API routes before P3-002", () => {
    const appSource = read("src/app.ts");

    expect(appSource).not.toContain('/organizations');
    expect(appSource).not.toContain('/organization');
  });
});
