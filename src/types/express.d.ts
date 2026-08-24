import "express";

declare global {
  namespace Express {
    interface Request {
      authType?: "user" | "service";

      user?: {
        id?: string;
        email?: string;
      };
    }
  }
}

export {};
