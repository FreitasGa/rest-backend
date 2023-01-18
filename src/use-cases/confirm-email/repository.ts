import type { Prisma } from '@prisma/client';

import type { User } from '@entities/user';

export interface ConfirmEmailRepository {
  confirmUser(id: string): Promise<void>;
  getUser(email: string): Promise<User | null>;
}

export class PrismaConfirmEmailRepository implements ConfirmEmailRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async confirmUser(id: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        confirmed: true,
      },
    });
  }

  async getUser(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
