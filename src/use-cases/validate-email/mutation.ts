import type { Prisma } from '@prisma/client';

export interface ValidateEmailMutation {
  confirmUserById(id: string): Promise<void>;
}

export class PrismaValidateEmailMutation implements ValidateEmailMutation {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async confirmUserById(id: string): Promise<void> {
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
