import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        requestId: res.getHeader("x-request-id"),
      },
      "HTTP request completed",
    );
  });

  next();
};
