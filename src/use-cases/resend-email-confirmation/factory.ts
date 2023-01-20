import { prisma } from '@modules/database';
import { HotpOtpService } from '@services/otp/external';
import { BullEmailQueueService } from '@services/queue/email/external';
import { PrismaResendEmailConfirmationRepository } from './repository';
import { ResendEmailConfirmationUseCase } from './use-case';

export async function buildUseCase(): Promise<ResendEmailConfirmationUseCase> {
  const repository = new PrismaResendEmailConfirmationRepository(prisma);
  const otpService = new HotpOtpService();
  const emailQueueService = new BullEmailQueueService();

  return new ResendEmailConfirmationUseCase(
    repository,
    otpService,
    emailQueueService
  );
}
