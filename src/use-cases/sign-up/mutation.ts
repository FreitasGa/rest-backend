import type { Prisma } from '@prisma/client';

import type { User } from '@entities/user';

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export interface SignUpMutation {
  /**
   * Create user
   * @param input data: name, email, password
   */
  createUser(input: CreateUserInput): Promise<User>;
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
}
