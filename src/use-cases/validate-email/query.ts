import type { Prisma } from '@prisma/client';

import type { User } from '@entities/user';

export interface ValidateEmailQuery {
  getUserByEmail(email: string): Promise<User | null>;
}

export class PrismaValidateEmailQuery implements ValidateEmailQuery {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
