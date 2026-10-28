import { prisma } from "../config/database";
import type { User } from "../generated/prisma/client";

export type { User };

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export type UpdateUserInput = Partial<CreateUserInput>;

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  }

  async create(input: CreateUserInput): Promise<User> {
    return prisma.user.create({ data: input });
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    return prisma.user.update({ where: { id }, data: input });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
}
