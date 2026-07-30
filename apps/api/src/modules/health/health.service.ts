import { prisma } from "../../database/prisma";
import { env } from "../../config/env";
import type { HealthStatus, MetaStatus, ReadinessStatus } from "./health.types";

export function getHealthStatus(): HealthStatus {
  return {
    status: "ok",
    service: "api",
    timestamp: new Date().toISOString()
  };
}

export async function getReadinessStatus(): Promise<ReadinessStatus> {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "ready",
      checks: { database: "ok" },
      timestamp: new Date().toISOString()
    };
  } catch {
    return {
      status: "not_ready",
      checks: { database: "error" },
      timestamp: new Date().toISOString()
    };
  }
}

export function getMetaStatus(): MetaStatus {
  return {
    name: "ThesiFlow",
    version: env.APP_VERSION,
    architecture: "modular-monolith-first",
    phase: "phase-1-foundation",
    implementationStatus: "foundation-in-progress"
  };
}
