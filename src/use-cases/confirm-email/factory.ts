import { prisma } from '@modules/database';
import { HotpOtpService } from '@services/otp/external';
import { PrismaConfirmEmailRepository } from './repository';
import { ConfirmEmailUseCase } from './use-case';

export async function buildUseCase(): Promise<ConfirmEmailUseCase> {
  const repository = new PrismaConfirmEmailRepository(prisma);
  const optService = new HotpOtpService();

  return new ConfirmEmailUseCase(repository, optService);
}
