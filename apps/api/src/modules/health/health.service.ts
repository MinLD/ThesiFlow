import type { HealthStatus } from "./health.types";

export function getHealthStatus(): HealthStatus {
  return {
    status: "ok",
    service: "api",
    timestamp: new Date().toISOString()
  };
}
