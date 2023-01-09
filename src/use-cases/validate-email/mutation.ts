import type { Prisma } from '@prisma/client';

export interface ValidateEmailMutation {
  /**
   * Confirm user
   * @param id user id
   */
  confirmUser(id: string): Promise<void>;
}

export class PrismaValidateEmailMutation implements ValidateEmailMutation {
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
