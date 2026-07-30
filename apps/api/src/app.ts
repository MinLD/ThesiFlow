import express from "express";
import { errorHandler } from "./common/middleware/errorHandler";
import { notFoundHandler } from "./common/middleware/notFound";
import { requestIdMiddleware } from "./common/middleware/requestId";
import { corsMiddleware, helmetMiddleware, jsonBodyParser, rateLimitMiddleware } from "./common/middleware/security";
import { getMeta, getReady } from "./modules/health/health.controller";
import { healthRouter } from "./modules/health/health.routes";

export function createApp() {
  const app = express();

  app.use(requestIdMiddleware);
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(jsonBodyParser);
  app.use(rateLimitMiddleware);

  app.use("/health", healthRouter);
  app.get("/ready", getReady);
  app.get("/api/v1/meta", getMeta);

  if (process.env.NODE_ENV === "test") {
    app.get("/__test/error", () => {
      throw new Error("Raw test stack marker");
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
