import type { Prisma } from '@prisma/client';

export interface SignUpQuery {
  /**
   * Check if user exists
   * @param email user email
   */
  userExists(email: string): Promise<boolean>;
}

export class PrismaSignUpQuery implements SignUpQuery {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async userExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user !== null;
  }
}
