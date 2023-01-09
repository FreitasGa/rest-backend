import type { Prisma } from '@prisma/client';

import type { User } from '@entities/user';

export interface ResendConfirmationMutation {
  incrementUserCounterById(id: string): Promise<User>;
}

export class PrismaResendConfirmationMutation
  implements ResendConfirmationMutation
{
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  incrementUserCounterById(id: string): Promise<User> {
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
