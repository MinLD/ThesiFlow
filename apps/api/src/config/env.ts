import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

for (const envPath of [
  path.resolve(process.cwd(), ".env"),
  ...(process.env.INIT_CWD ? [path.resolve(process.env.INIT_CWD, ".env")] : []),
  path.resolve(process.cwd(), "../../.env"),
]) {
  dotenv.config({ path: envPath });
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (value) =>
        value.startsWith("postgresql://") || value.startsWith("postgres://"),
      {
        message: "DATABASE_URL must be a PostgreSQL connection string",
      },
    ),
  FRONTEND_URL: z.string().url(),
  CORS_ORIGIN: z.string().min(1),
  JSON_BODY_LIMIT: z.string().min(1).default("1mb"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
  REFRESH_TOKEN_COOKIE_NAME: z.string().min(1).default("refresh_token"),
  COOKIE_SECURE: z.coerce.boolean().default(false),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(12),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_SECURE: z.coerce.boolean().default(true),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASS: z.string().min(1).optional(),
  MAIL_FROM: z.string().min(1).optional(),
  APP_VERSION: z.string().min(1).default("0.1.0"),
  OUTBOX_CLAIM_LIMIT: z.coerce.number().int().positive().default(10),
  WORKER_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(5_000),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    throw new Error(`ENV_VALIDATION_ERROR: ${JSON.stringify(errors)}`);
  }

  return result.data;
}

export const env = parseEnv(process.env);
