import type { Prisma } from '@prisma/client';

import type { User } from '@entities/user';

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export interface SignUpRepository {
  createUser(input: CreateUserInput): Promise<User>;
  userExists(email: string): Promise<boolean>;
}

export class PrismaSignUpRepository implements SignUpRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async createUser(input: CreateUserInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
      },
    });

    return user;
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return !!user;
  }
}
