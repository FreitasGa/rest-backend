import type { Prisma } from '@prisma/client';

export interface ConfirmEmailMutation {
  confirmUser(id: string): Promise<void>;
}

export class PrismaConfirmEmailMutation implements ConfirmEmailMutation {
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
}
