import dotenv from "dotenv";
import path from "path";
import { logger } from "./logger";

const environment = process.env.NODE_ENV || "dev";

const envPath = path.resolve(process.cwd(), "envs", `.env.${environment}`);
dotenv.config({
  path: envPath,
});
logger.info(`Environment: ${environment}`);
logger.info(`Loaded env file: ${envPath}`);

export { environment };
