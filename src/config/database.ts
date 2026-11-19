import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client";
import { logger } from "./logger";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();

  logger.info("Database connected successfully");
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();

  logger.info("Database connection closed");
};
