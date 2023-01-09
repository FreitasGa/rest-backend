import type { Prisma } from '@prisma/client';

export interface ValidateEmailMutation {
  confirmUserById(userId: string): Promise<void>;
}

export class PrismaValidateEmailMutation implements ValidateEmailMutation {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async confirmUserById(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        confirmed: true,
      },
    });
  }
}
