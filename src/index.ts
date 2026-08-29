import "./config/env";
import express from "express";
import { connectRedis, redisClient } from "./config/redis";
import { logger } from "./config/logger";
import authRoutes from "./routes/auth.routes";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { requestIdMiddleware } from "./middlewares/request-id.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(requestIdMiddleware);
app.use(express.json());
app.use(loggerMiddleware);
app.use("/auth", authRoutes);
app.use(errorMiddleware);

const startServer = async (): Promise<void> => {
  try {
    await connectRedis();

    const server = app.listen(process.env.PORT, () => {
      logger.info(
        {
          port: process.env.PORT,
          environment: process.env.NODE_ENV,
        },
        "Server started",
      );
    });

    // ==========================================
    // GRACEFUL SHUTDOWN
    // ==========================================

    const shutdown = async (signal: string): Promise<void> => {
      logger.info(
        {
          signal,
        },
        "Shutdown signal received",
      );

      // 1. Stop accepting new HTTP requests
      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          // 2. Close Redis
          if (redisClient.isOpen) {
            await redisClient.quit();

            logger.info("Redis connection closed");
          }

          // 3. Close database
          // await disconnectDatabase();

          logger.info("Graceful shutdown completed");

          process.exit(0);
        } catch (error) {
          logger.error(
            {
              error,
            },
            "Error during graceful shutdown",
          );

          process.exit(1);
        }
      });
    };

    // ==========================================
    // PROCESS SIGNALS
    // ==========================================

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });
  } catch (error) {
    logger.fatal(
      {
        error,
      },
      "Failed to start server",
    );

    process.exit(1);
  }
};

void startServer();
