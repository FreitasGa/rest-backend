import { prisma } from '@modules/database';
import { HotpOtpService } from '@services/otp/external';
import { BullEmailQueueService } from '@services/queue/email/external';
import { PrismaResendEmailConfirmationQuery } from './query';
import { ResendEmailConfirmationUseCase } from './use-case';

export async function buildUseCase(): Promise<ResendEmailConfirmationUseCase> {
  const query = new PrismaResendEmailConfirmationQuery(prisma);
  const otpService = new HotpOtpService();
  const emailQueueService = new BullEmailQueueService();

  return new ResendEmailConfirmationUseCase(
    query,
    otpService,
    emailQueueService
  );
}
