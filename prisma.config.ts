import dotenv from "dotenv";
import path from "path";
import { defineConfig, env } from "prisma/config";

const environment = process.env.NODE_ENV || "dev";

dotenv.config({
  path: path.resolve(process.cwd(), "envs", `.env.${environment}`),
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
