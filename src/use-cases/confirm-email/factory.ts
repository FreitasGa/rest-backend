import { prisma } from '@modules/database';
import { HotpOtpService } from '@services/otp/external';
import { PrismaConfirmEmailMutation } from './mutation';
import { PrismaConfirmEmailQuery } from './query';
import { ConfirmEmailUseCase } from './use-case';

export async function buildUseCase(): Promise<ConfirmEmailUseCase> {
  const query = new PrismaConfirmEmailQuery(prisma);
  const mutation = new PrismaConfirmEmailMutation(prisma);
  const optService = new HotpOtpService();

  return new ConfirmEmailUseCase(query, mutation, optService);
}
