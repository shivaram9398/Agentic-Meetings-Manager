import dotenv from "dotenv";
import path from "path";

const environment = process.env.NODE_ENV || "dev";

const envPath = path.resolve(process.cwd(), "envs", `.env.${environment}`);

dotenv.config({
  path: envPath,
});

console.log(`Environment: ${environment}`);
console.log(`Loaded env file: ${envPath}`);

export const env = {
  NODE_ENV: environment,
  PORT: Number(process.env.PORT) || 3000,

  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
};
