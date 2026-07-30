import { createHash } from "node:crypto";

type IdempotencyRecordStatus = "processing" | "completed" | "failed";

type IdempotencyRecord = {
  id: string;
  scope: string;
  key: string;
  requestHash: string;
  status: IdempotencyRecordStatus;
  responseStatus: number | null;
  responseBody: unknown;
  expiresAt: Date;
};

type IdempotencyRecordStore = {
  findUnique(args: { where: { scope_key: { scope: string; key: string } } }): Promise<IdempotencyRecord | null>;
  create(args: { data: { scope: string; key: string; requestHash: string; expiresAt: Date } }): Promise<IdempotencyRecord>;
  update(args: {
    where: { id: string };
    data: { status: IdempotencyRecordStatus; responseStatus?: number; responseBody?: unknown };
  }): Promise<IdempotencyRecord>;
};

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableJson).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => `${JSON.stringify(key)}:${stableJson(nested)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

export function hashIdempotencyPayload(payload: unknown): string {
  return createHash("sha256").update(stableJson(payload)).digest("hex");
}

export async function beginIdempotentOperation(
  store: IdempotencyRecordStore,
  input: { scope: string; key: string; payload: unknown; expiresAt: Date }
) {
  const requestHash = hashIdempotencyPayload(input.payload);
  const existing = await store.findUnique({ where: { scope_key: { scope: input.scope, key: input.key } } });

  if (!existing) {
    return {
      kind: "started" as const,
      record: await store.create({
        data: { scope: input.scope, key: input.key, requestHash, expiresAt: input.expiresAt }
      })
    };
  }

  if (existing.requestHash !== requestHash) {
    return { kind: "conflict" as const, record: existing };
  }

  if (existing.status === "completed") {
    return { kind: "replay" as const, record: existing };
  }

  return { kind: "in_progress" as const, record: existing };
}

export async function completeIdempotentOperation(
  store: IdempotencyRecordStore,
  recordId: string,
  response: { status: number; body: unknown }
) {
  return store.update({
    where: { id: recordId },
    data: { status: "completed", responseStatus: response.status, responseBody: response.body }
  });
}
