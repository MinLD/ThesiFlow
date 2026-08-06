import path from "node:path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Pool, type PoolClient } from "pg";
import { z } from "zod";

for (const envPath of [
  path.resolve(process.cwd(), ".env"),
  ...(process.env.INIT_CWD ? [path.resolve(process.env.INIT_CWD, ".env")] : []),
  path.resolve(process.cwd(), "../../.env"),
]) {
  dotenv.config({ path: envPath });
}

const env = z.object({
  DATABASE_URL: z.string().min(1),
  OUTBOX_CLAIM_LIMIT: z.coerce.number().int().positive().default(10),
  WORKER_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(5_000),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_SECURE: z.coerce.boolean().default(true),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASS: z.string().min(1).optional(),
  MAIL_FROM: z.string().min(1).optional(),
}).parse(process.env);

const pool = new Pool({ connectionString: env.DATABASE_URL });

type MailPayload = {
  to: string;
  subject: string;
  text: string;
  html: string;
  purpose?: string;
};

export type OutboxRow = {
  id: string;
  eventType: string;
  aggregateType: string | null;
  aggregateId: string | null;
  payload: unknown;
  attempts: number;
};

function isMailPayload(payload: unknown): payload is MailPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const value = payload as Record<string, unknown>;
  return ["to", "subject", "text", "html"].every((key) => typeof value[key] === "string");
}

function createMailTransport() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !env.MAIL_FROM) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    pool: true,
  });
}

const mailTransport = createMailTransport();

async function claimRows(client: PoolClient, claimLimit: number): Promise<OutboxRow[]> {
  await client.query("BEGIN");
  try {
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
        RETURNING id, event_type AS "eventType", aggregate_type AS "aggregateType", aggregate_id AS "aggregateId", payload, attempts
      `,
      [claimLimit],
    );
    await client.query("COMMIT");
    return rows;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function markPublished(client: PoolClient, row: OutboxRow, sanitizePayload = false): Promise<void> {
  const payloadSql = sanitizePayload
    ? ", payload = jsonb_build_object('eventType', event_type, 'delivered', true, 'purpose', payload->>'purpose')"
    : "";

  await client.query(
    `
      UPDATE outbox_events
      SET status = 'published', published_at = now(), updated_at = now(), locked_at = NULL, last_error = NULL${payloadSql}
      WHERE id = $1
    `,
    [row.id],
  );
}

async function markFailed(client: PoolClient, row: OutboxRow, error: unknown): Promise<void> {
  const message = error instanceof Error ? error.message : "Unknown error";
  const delaySeconds = Math.min(300, Math.max(10, row.attempts * 30));

  await client.query(
    `
      UPDATE outbox_events
      SET status = 'failed', updated_at = now(), locked_at = NULL, last_error = $2,
          available_at = now() + ($3::text || ' seconds')::interval
      WHERE id = $1
    `,
    [row.id, message.slice(0, 1_000), delaySeconds],
  );
}

async function publishRow(client: PoolClient, row: OutboxRow): Promise<void> {
  if (row.eventType !== "mail.send.v1") {
    await markPublished(client, row);
    return;
  }

  if (!isMailPayload(row.payload)) {
    throw new Error("INVALID_MAIL_OUTBOX_PAYLOAD");
  }

  if (!mailTransport || !env.MAIL_FROM) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }

  await mailTransport.sendMail({
    from: env.MAIL_FROM,
    to: row.payload.to,
    subject: row.payload.subject,
    text: row.payload.text,
    html: row.payload.html,
  });
  await markPublished(client, row, true);
}

export async function claimAndPublish(targetPool: Pick<Pool, "connect"> = pool, claimLimit = env.OUTBOX_CLAIM_LIMIT): Promise<number> {
  const client = await targetPool.connect();

  try {
    const rows = await claimRows(client, claimLimit);

    for (const row of rows) {
      try {
        await publishRow(client, row);
      } catch (error) {
        await markFailed(client, row, error);
        console.error(JSON.stringify({ level: "error", message: "Outbox publish failed", outboxId: row.id, eventType: row.eventType, error: error instanceof Error ? error.message : "Unknown error" }));
      }
    }

    return rows.length;
  } catch (error) {
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

async function shutdown(): Promise<void> {
  if (mailTransport) {
    mailTransport.close();
  }
  await pool.end();
}

process.on("SIGTERM", () => void shutdown().finally(() => process.exit(0)));
process.on("SIGINT", () => void shutdown().finally(() => process.exit(0)));

if (require.main === module) {
  void loop();
}
