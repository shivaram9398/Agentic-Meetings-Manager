import type { Request, Response, NextFunction } from "express";

import jwt, { type JwtPayload } from "jsonwebtoken";
import crypto from "crypto";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const apiKey = req.headers["x-api-key"];
  const authorization = req.headers.authorization;

  // ==========================================
  // 1. Reject if both authentication methods exist
  // ==========================================

  if (apiKey && authorization) {
    res.status(400).json({
      message: "Use either x-api-key or access token",
    });

    return;
  }

  // ==========================================
  // 2. SERVICE AUTHENTICATION - x-api-key
  // ==========================================

  if (typeof apiKey === "string") {
    const expectedApiKey = process.env.INTERNAL_API_KEY;

    if (!expectedApiKey) {
      throw new Error("INTERNAL_API_KEY is not configured");
    }

    const isValid =
      apiKey.length === expectedApiKey.length &&
      crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(expectedApiKey));

    if (!isValid) {
      res.status(401).json({
        message: "Invalid API key",
      });

      return;
    }

    req.authType = "service";

    next();
    return;
  }

  // ==========================================
  // 3. USER AUTHENTICATION - Bearer Token
  // ==========================================

  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.substring(7);

    const jwtSecret = process.env.JWT_ACCESS_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_ACCESS_SECRET is not configured");
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      req.authType = "user";

      req.user = {
        id: decoded.sub,
        email: decoded.email,
      };

      next();
      return;
    } catch {
      res.status(401).json({
        message: "Invalid or expired access token",
      });

      return;
    }
  }

  // ==========================================
  // 4. NO AUTHENTICATION PROVIDED
  // ==========================================

  res.status(401).json({
    message: "Authentication required",
  });
};
