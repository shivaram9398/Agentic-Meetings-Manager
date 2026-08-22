import express from "express";
import { env } from "./config/env";
import { connectRedis } from "./config/redis";

const app = express();

app.use(express.json());

const startServer = async (): Promise<void> => {
  try {
    await connectRedis();

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
