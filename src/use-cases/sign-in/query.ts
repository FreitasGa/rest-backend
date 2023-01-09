import type { Prisma } from '@prisma/client';

import type { User } from '@entities/user';

export interface SingInQuery {
  /**
   * Get user by email
   * @param email user email
   */
  getUser(email: string): Promise<User | null>;
}

export class PrismaSingInQuery implements SingInQuery {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async getUser(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}
