import type { Prisma } from '@prisma/client';

import type { User } from '@entities/user';

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export type IncrementUserCounterInput = {
  userId: string;
};

export interface SignUpMutation {
  createUser(input: CreateUserInput): Promise<User>;
  incrementUserCounter(input: IncrementUserCounterInput): Promise<void>;
}

export class PrismaSignUpMutation implements SignUpMutation {
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

  async incrementUserCounter(input: IncrementUserCounterInput): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: input.userId,
      },
      data: {
        counter: {
          increment: 1,
        },
      },
    });
  }
}
