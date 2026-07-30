import "dotenv/config";
import { Pool } from "pg";
import { z } from "zod";

const env = z.object({
  DATABASE_URL: z.string().min(1),
  OUTBOX_CLAIM_LIMIT: z.coerce.number().int().positive().default(10),
  WORKER_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(5_000)
}).parse(process.env);

const pool = new Pool({ connectionString: env.DATABASE_URL });

type OutboxRow = { id: string };

async function claimAndPublish(): Promise<number> {
  const client = await pool.connect();


  try {
    await client.query("BEGIN");
    const { rows } = await client.query<OutboxRow>(
      `
        UPDATE outbox_events
        SET status = 'processing', locked_at = now(), attempts = attempts + 1, updated_at = now()
        WHERE id IN (
          SELECT id
          FROM outbox_events
          WHERE status IN ('pending', 'failed') AND available_at <= now()
          ORDER BY available_at ASC
          FOR UPDATE SKIP LOCKED
          LIMIT $1
        )
        RETURNING id
      `,
      [env.OUTBOX_CLAIM_LIMIT]
    );

    if (rows.length > 0) {
      // ponytail: only marks events published; replace with adapters when real notifications exist.
      await client.query(
        `
          UPDATE outbox_events
          SET status = 'published', published_at = now(), updated_at = now(), last_error = NULL
          WHERE id = ANY($1::text[])
        `,
        [rows.map((row) => row.id)]
      );
    }

    await client.query("COMMIT");
    return rows.length;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(JSON.stringify({ level: "error", message: "Worker poll failed", error: error instanceof Error ? error.message : "Unknown error" }));
    return 0;
  } finally {
    client.release();
  }
}

async function loop(): Promise<void> {
  await claimAndPublish();
  setTimeout(() => void loop(), env.WORKER_POLL_INTERVAL_MS);
}

process.on("SIGTERM", () => void pool.end().finally(() => process.exit(0)));
process.on("SIGINT", () => void pool.end().finally(() => process.exit(0)));

void loop();
