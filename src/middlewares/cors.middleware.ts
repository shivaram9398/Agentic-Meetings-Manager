import cors from "cors";

import { logger } from "../config/logger";
import { AppError } from "../utils/app-error";

// Comma-separated allowlist, e.g. CORS_ORIGINS=http://localhost:5173,https://app.example.com
const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  logger.warn("CORS_ORIGINS is not set — all cross-origin browser requests will be rejected");
}

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Requests without an Origin header (curl, server-to-server, same-origin) are allowed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new AppError(`Origin ${origin} not allowed by CORS`, 403));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
  exposedHeaders: ["x-request-id"],
});
