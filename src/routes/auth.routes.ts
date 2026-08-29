import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";

const router = Router();

// Create dependencies
const userRepository = new UserRepository();

const authService = new AuthService(userRepository);

const authController = new AuthController(authService);

// Public routes
router.post("/register", authController.register);

router.post("/login", authController.login);

export default router;
