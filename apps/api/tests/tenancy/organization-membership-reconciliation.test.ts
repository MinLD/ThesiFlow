import { randomUUID, createHash } from "node:crypto";
import { afterAll, afterEach, describe, expect, it } from "vitest";
import { prisma } from "../../src/database/prisma";

type DbError = {
  code?: string;
  meta?: { code?: string; message?: string; driverAdapterError?: { cause?: { originalCode?: string } } };
  message?: string;
};

const accountIds = new Set<string>();
const organizationIds = new Set<string>();

function sql(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

function dbCode(error: unknown) {
  const dbError = error as DbError;
  return dbError.meta?.code ?? dbError.meta?.driverAdapterError?.cause?.originalCode ?? dbError.message ?? dbError.code ?? "";
}

async function ignoreMissingRelation(statement: string) {
  try {
    await prisma.$executeRawUnsafe(statement);
  } catch (error) {
    if (!dbCode(error).includes("42P01") && !dbCode(error).includes("does not exist")) {
      throw error;
    }
  }
}

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.test`;
}

function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

async function createAccount(email = uniqueEmail("p3-account")) {
  const id = randomUUID();
  await prisma.$executeRawUnsafe(`
    INSERT INTO "accounts" ("id", "email", "full_name", "status", "created_at", "updated_at")
    VALUES (${sql(id)}, ${sql(email.toLowerCase())}, 'Phase 3 Account', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  accountIds.add(id);
  return id;
}

async function createOrganization(name: string) {
  const id = randomUUID();
  const slug = `${name.toLowerCase().replaceAll(" ", "-")}-${id.slice(0, 8)}`;
  await prisma.$executeRawUnsafe(`
    INSERT INTO "organizations" ("id", "name", "slug", "status", "verified_at", "created_at", "updated_at")
    VALUES (${sql(id)}, ${sql(name)}, ${sql(slug)}, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  organizationIds.add(id);
  return id;
}

async function createMembership(organizationId: string, accountId: string, status: "active" | "inactive" | "invited") {
  await prisma.$executeRawUnsafe(`
    INSERT INTO "tenant_memberships" (
      "id", "organization_id", "account_id", "status", "source", "activated_at", "created_at", "updated_at"
    ) VALUES (
      ${sql(randomUUID())}, ${sql(organizationId)}, ${sql(accountId)}, ${sql(status)}, 'provisioning',
      ${status === "active" ? "CURRENT_TIMESTAMP" : "NULL"}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
  `);
}

afterEach(async () => {
  if (organizationIds.size > 0) {
    const organizationList = [...organizationIds].map(sql).join(", ");
    await ignoreMissingRelation(`DELETE FROM "membership_invitations" WHERE "organization_id" IN (${organizationList})`);
    await ignoreMissingRelation(`DELETE FROM "tenant_memberships" WHERE "organization_id" IN (${organizationList})`);
    await ignoreMissingRelation(`DELETE FROM "organizations" WHERE "id" IN (${organizationList})`);
  }

  if (accountIds.size > 0) {
    await ignoreMissingRelation(`DELETE FROM "accounts" WHERE "id" IN (${[...accountIds].map(sql).join(", ")})`);
  }

  organizationIds.clear();
  accountIds.clear();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Phase 3 organization and membership reconciliation", () => {
  it("allows one global account to have active memberships in multiple organizations", async () => {
    const accountId = await createAccount();
    const firstOrganizationId = await createOrganization("APLP Demo University");
    const secondOrganizationId = await createOrganization("APLP Research Institute");

    await createMembership(firstOrganizationId, accountId, "active");
    await createMembership(secondOrganizationId, accountId, "active");

    const rows = await prisma.$queryRawUnsafe<Array<{ organization_id: string; status: string }>>(`
      SELECT "organization_id", "status"
      FROM "tenant_memberships"
      WHERE "account_id" = ${sql(accountId)}
      ORDER BY "organization_id"
    `);

    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.status)).toEqual(["active", "active"]);
  });

  it("rejects duplicate membership for the same account and organization", async () => {
    const accountId = await createAccount();
    const organizationId = await createOrganization("Duplicate Guard University");
    await createMembership(organizationId, accountId, "active");

    try {
      await createMembership(organizationId, accountId, "active");
      throw new Error("Expected duplicate membership to fail");
    } catch (error) {
      expect(dbCode(error)).toContain("23505");
    }
  });

  it("excludes inactive memberships from active tenant context lookup", async () => {
    const accountId = await createAccount();
    const activeOrganizationId = await createOrganization("Active Context University");
    const inactiveOrganizationId = await createOrganization("Inactive Context University");
    await createMembership(activeOrganizationId, accountId, "active");
    await createMembership(inactiveOrganizationId, accountId, "inactive");

    const rows = await prisma.$queryRawUnsafe<Array<{ organization_id: string }>>(`
      SELECT "organization_id"
      FROM "tenant_memberships"
      WHERE "account_id" = ${sql(accountId)} AND "status" = 'active'
    `);

    expect(rows).toEqual([{ organization_id: activeOrganizationId }]);
  });

  it("stores membership invitations with organization, recipient, expiry, inviter, and unique token hash", async () => {
    const inviterAccountId = await createAccount(uniqueEmail("p3-inviter"));
    const organizationId = await createOrganization("Invitation Guard University");
    const tokenHash = hashToken(randomUUID());

    await prisma.$executeRawUnsafe(`
      INSERT INTO "membership_invitations" (
        "id", "organization_id", "email", "token_hash", "status", "invited_by_account_id",
        "expires_at", "created_at", "updated_at"
      ) VALUES (
        ${sql(randomUUID())}, ${sql(organizationId)}, 'student@example.test', ${sql(tokenHash)}, 'pending',
        ${sql(inviterAccountId)}, CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `);

    try {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "membership_invitations" (
          "id", "organization_id", "email", "token_hash", "status", "invited_by_account_id",
          "expires_at", "created_at", "updated_at"
        ) VALUES (
          ${sql(randomUUID())}, ${sql(organizationId)}, 'another@example.test', ${sql(tokenHash)}, 'pending',
          ${sql(inviterAccountId)}, CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `);
      throw new Error("Expected duplicate invitation token hash to fail");
    } catch (error) {
      expect(dbCode(error)).toContain("23505");
    }
  });
});
