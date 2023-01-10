import type { Prisma } from '@prisma/client';

import type { User } from '@entities/user';

export interface ResendEmailConfirmationMutation {
  /**
   * Increment user counter
   * @param id user id
   */
  incrementUserCounter(id: string): Promise<User>;
}

export class PrismaResendEmailConfirmationMutation
  implements ResendEmailConfirmationMutation
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
