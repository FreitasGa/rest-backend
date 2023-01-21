import type { Prisma } from '@prisma/client';

import type { User } from '@entities/user';

export interface ForgotPasswordRepository {
  getUser(email: string): Promise<User | null>;
}

export class PrismaForgotPasswordRepository
  implements ForgotPasswordRepository
{
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async getUser(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
