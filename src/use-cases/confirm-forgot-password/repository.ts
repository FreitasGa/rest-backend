import type { User } from '@entities/user';
import type { Prisma } from '@prisma/client';

export type ChangePasswordInput = {
  id: string;
  password: string;
};

export interface ConfirmForgotPasswordRepository {
  getUser(email: string): Promise<User | null>;
  changePassword(input: ChangePasswordInput): Promise<void>;
}

export class PrismaConfirmForgotPasswordRepository
  implements ConfirmForgotPasswordRepository
{
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async getUser(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        password: input.password,
      },
    });
  }
}
