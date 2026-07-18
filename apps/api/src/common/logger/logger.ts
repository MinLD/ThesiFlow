import { env } from "../../config/env";

type LogLevel = "debug" | "info" | "warn" | "error";
type LogMetadata = Record<string, unknown>;

const levelWeight: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

const sensitiveKeyPattern = /password|secret|token|cookie|authorization/i;

function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redact);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
        key,
        sensitiveKeyPattern.test(key) ? "[REDACTED]" : redact(nestedValue)
      ])
    );
  }

  return value;
}

function shouldLog(level: LogLevel): boolean {
  return levelWeight[level] >= levelWeight[env.LOG_LEVEL];
}

function write(level: LogLevel, message: string, metadata: LogMetadata = {}): void {
  if (!shouldLog(level)) {
    return;
  }

  const redactedMetadata = redact(metadata) as LogMetadata;
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...redactedMetadata
  };

  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export const logger = {
  debug: (message: string, metadata?: LogMetadata) => write("debug", message, metadata),
  info: (message: string, metadata?: LogMetadata) => write("info", message, metadata),
  warn: (message: string, metadata?: LogMetadata) => write("warn", message, metadata),
  error: (message: string, metadata?: LogMetadata) => write("error", message, metadata)
};
