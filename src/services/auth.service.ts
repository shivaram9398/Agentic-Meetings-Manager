import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Prisma } from "../generated/prisma/client";
import { AppError } from "../utils/app-error";
import { UserRepository, type User } from "../repositories/user.repository";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(input: RegisterInput) {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    try {
      const user = await this.userRepository.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
      });

      return this.formatUser(user);
    } catch (error) {
      // Two concurrent registrations can both pass the check above
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError("User already exists", 409);
      }

      throw error;
    }
  }

  async login(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const jwtSecret = process.env.JWT_ACCESS_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_ACCESS_SECRET is not configured");
    }

    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      jwtSecret,
      {
        expiresIn: "15m",
      },
    );

    return {
      accessToken,
      user: this.formatUser(user),
    };
  }

  private formatUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
