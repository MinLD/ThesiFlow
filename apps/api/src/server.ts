import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./common/logger/logger";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info("API server started", { port: env.PORT });
});

server.on("error", (error) => {
  logger.error("API server failed to start", { error });
});
