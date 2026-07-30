export type HealthStatus = {
  status: "ok";
  service: "api";
  timestamp: string;
};

export type ReadinessStatus = {
  status: "ready" | "not_ready";
  checks: {
    database: "ok" | "error";
  };
  timestamp: string;
};

export type MetaStatus = {
  name: "ThesiFlow";
  version: string;
  architecture: "modular-monolith-first";
  phase: "phase-1-foundation";
  implementationStatus: "foundation-in-progress";
};
