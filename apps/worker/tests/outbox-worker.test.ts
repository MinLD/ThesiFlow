import { randomUUID } from "node:crypto";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { claimAndPublish, type OutboxRow } from "../src/index";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const aggregateType = "worker-outbox-test";
const testRunId = randomUUID();

type OutboxStatus = "pending" | "processing" | "published" | "failed";

type StoredOutboxEvent = {
  id: string;
  status: OutboxStatus;
  attempts: number;
  locked_at: Date | null;
  published_at: Date | null;
  last_error: string | null;
  available_at: Date;
  is_available_in_future: boolean;
};

async function insertOutboxEvent(input: {
  status?: OutboxStatus;
  aggregateId?: string;
  availableInMs?: number;
  lockedAgeMs?: number;
  locked?: boolean;
  attempts?: number;
} = {}): Promise<string> {
  const id = randomUUID();
  await pool.query(
    `
      INSERT INTO outbox_events (
        id, event_type, aggregate_type, aggregate_id, payload, status,
        attempts, available_at, locked_at, updated_at
      )
      VALUES (
        $1, 'worker.test.v1', $2, $3, $4::jsonb, $5::"OutboxEventStatus", $6,
        now() + ($7::text || ' milliseconds')::interval,
        CASE WHEN $8::boolean THEN now() - ($9::text || ' milliseconds')::interval ELSE NULL END,
        now()
      )
    `,
    [
      id,
      aggregateType,
      input.aggregateId ?? `${testRunId}:${id}`,
      JSON.stringify({ ok: true }),
      input.status ?? "pending",
      input.attempts ?? 0,
      input.availableInMs ?? -1_000,
      input.locked ?? false,
      input.lockedAgeMs ?? 0
    ]
  );
  return id;
}

async function readOutboxEvent(id: string): Promise<StoredOutboxEvent> {
  const { rows } = await pool.query<StoredOutboxEvent>(
    `
      SELECT id, status, attempts, locked_at, published_at, last_error, available_at, available_at > now() AS is_available_in_future
      FROM outbox_events
      WHERE id = $1
    `,
    [id]
  );
  if (!rows[0]) {
    throw new Error(`Missing outbox event ${id}`);
  }
  return rows[0];
}

async function countPublished(): Promise<number> {
  const { rows } = await pool.query<{ count: string }>(
    "SELECT count(*) FROM outbox_events WHERE aggregate_type = $1 AND status = 'published'",
    [aggregateType]
  );
  return Number(rows[0]?.count ?? 0);
}

beforeAll(async () => {
  await pool.query("SELECT 1");
});

beforeEach(async () => {
  await pool.query("DELETE FROM outbox_events");
});

afterAll(async () => {
  await pool.query("DELETE FROM outbox_events");
  await pool.end();
});

describe("worker outbox claim lifecycle", () => {
  it("claims no more than the configured limit", async () => {
    await Promise.all(Array.from({ length: 5 }, () => insertOutboxEvent()));

    const claimed = await claimAndPublish(pool, 2, { publish: async () => undefined });

    expect(claimed).toBe(2);
    expect(await countPublished()).toBe(2);
  });

  it("publishes a pending event after handler success", async () => {
    const id = await insertOutboxEvent();

    const claimed = await claimAndPublish(pool, 10, { publish: async () => undefined });
    const event = await readOutboxEvent(id);

    expect(claimed).toBe(1);
    expect(event.status).toBe("published");
    expect(event.attempts).toBe(1);
    expect(event.locked_at).toBeNull();
    expect(event.published_at).toBeInstanceOf(Date);
    expect(event.last_error).toBeNull();
  });

  it("retries failed events only after available_at", async () => {
    const readyId = await insertOutboxEvent({ status: "failed", availableInMs: -1_000 });
    const futureId = await insertOutboxEvent({ status: "failed", availableInMs: 60_000 });

    const claimedIds: string[] = [];
    const claimed = await claimAndPublish(pool, 10, {
      publish: async (row) => {
        claimedIds.push(row.id);
      }
    });

    expect(claimed).toBe(1);
    expect(claimedIds).toEqual([readyId]);
    expect((await readOutboxEvent(readyId)).status).toBe("published");
    expect((await readOutboxEvent(futureId)).status).toBe("failed");
  });

  it("does not reclaim an active processing lock", async () => {
    const id = await insertOutboxEvent({ status: "processing", locked: true, lockedAgeMs: 0 });

    const claimed = await claimAndPublish(pool, 10, { lockTimeoutMs: 300_000, publish: async () => undefined });
    const event = await readOutboxEvent(id);

    expect(claimed).toBe(0);
    expect(event.status).toBe("processing");
    expect(event.locked_at).toBeInstanceOf(Date);
  });

  it("reclaims a stale processing lock", async () => {
    const id = await insertOutboxEvent({
      status: "processing",
      locked: true,
      lockedAgeMs: 600_000,
      attempts: 2
    });

    const claimed = await claimAndPublish(pool, 10, { lockTimeoutMs: 300_000, publish: async () => undefined });
    const event = await readOutboxEvent(id);

    expect(claimed).toBe(1);
    expect(event.status).toBe("published");
    expect(event.attempts).toBe(3);
    expect(event.locked_at).toBeNull();
  });

  it("marks failed delivery with retry metadata", async () => {
    const id = await insertOutboxEvent();

    const claimed = await claimAndPublish(pool, 10, {
      publish: async () => {
        throw new Error("SMTP boom");
      }
    });
    const event = await readOutboxEvent(id);

    expect(claimed).toBe(1);
    expect(event.status).toBe("failed");
    expect(event.attempts).toBe(1);
    expect(event.locked_at).toBeNull();
    expect(event.published_at).toBeNull();
    expect(event.last_error).toBe("SMTP boom");
    expect(event.is_available_in_future).toBe(true);
  });

  it("does not process the same event in concurrent claims", async () => {
    await Promise.all(Array.from({ length: 4 }, () => insertOutboxEvent()));
    const processedIds: string[] = [];

    const publish = async (row: OutboxRow) => {
      processedIds.push(row.id);
      await sleep(50);
    };

    const results = await Promise.all([
      claimAndPublish(pool, 3, { publish }),
      claimAndPublish(pool, 3, { publish })
    ]);

    expect(results.reduce((total, count) => total + count, 0)).toBe(4);
    expect(new Set(processedIds).size).toBe(processedIds.length);
    expect(await countPublished()).toBe(4);
  });
});
