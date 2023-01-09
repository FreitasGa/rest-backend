import type { Prisma } from '@prisma/client';

import type { User } from '@entities/user';

export interface ResendConfirmationMutation {
  /**
   * Increment user counter
   * @param id user id
   */
  incrementUserCounter(id: string): Promise<User>;
}

export class PrismaResendConfirmationMutation
  implements ResendConfirmationMutation
{
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  incrementUserCounter(id: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        counter: {
          increment: 1,
        },
      },
    });
  }
}
