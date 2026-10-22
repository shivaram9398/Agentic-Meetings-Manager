import type { Request, Response, NextFunction } from "express";

import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);

      res.status(201).json({
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);

      res.status(200).json({
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
