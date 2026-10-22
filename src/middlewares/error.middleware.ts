import type { Request, Response, NextFunction } from "express";

import { logger } from "../config/logger";
import { AppError } from "../utils/app-error";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const requestId = res.getHeader("x-request-id");

  const statusCode = error instanceof AppError ? error.statusCode : 500;

  const message =
    error instanceof AppError ? error.message : "Internal server error";

  logger.error(
    {
      error,
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode,
    },
    "Request failed",
  );

  res.status(statusCode).json({
    message,
    requestId,
  });
};
