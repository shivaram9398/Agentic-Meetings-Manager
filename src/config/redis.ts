import { createClient } from "redis";
import { logger } from "./logger";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
  logger.error(
    {
      error,
    },
    "Redis client error",
  );
});

export const connectRedis = async (): Promise<void> => {
  await redisClient.connect();

  logger.info("Redis connected successfully");
};
