process.env.NODE_ENV ??= "test";
process.env.DATABASE_URL ??= "postgresql://thesiflow:12345678@localhost:5433/thesiflow?schema=public";
process.env.OUTBOX_CLAIM_LIMIT ??= "10";
process.env.WORKER_POLL_INTERVAL_MS ??= "5000";
process.env.OUTBOX_LOCK_TIMEOUT_MS ??= "300000";
