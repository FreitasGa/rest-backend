import type { Prisma } from '@prisma/client';

import type { User } from '@entities/user';

export interface ResendEmailConfirmationRepository {
  getUser(email: string): Promise<User | null>;
}

export class PrismaResendEmailConfirmationRepository
  implements ResendEmailConfirmationRepository
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
