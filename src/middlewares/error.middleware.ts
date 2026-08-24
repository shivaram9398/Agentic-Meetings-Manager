import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error({
    error,
    requestId: res.getHeader("x-request-id"),
  });

  res.status(500).json({
    message: "Internal server error",
    requestId: res.getHeader("x-request-id"),
  });
};
