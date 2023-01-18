import type { Prisma } from '@prisma/client';

import type { User } from '@entities/user';

export interface RefreshTokenQuery {
  getUser(id: string): Promise<User | null>;
}

export class PrismaRefreshTokenQuery implements RefreshTokenQuery {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async getUser(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }
}
