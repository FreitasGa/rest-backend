import { prisma } from '@modules/database';
import { HotpOtpService } from '@services/otp/external';
import { BullEmailQueueService } from '@services/queue/email/external';
import { PrismaResendEmailConfirmationMutation } from './mutation';
import { PrismaResendEmailConfirmationQuery } from './query';
import { ResendEmailConfirmationUseCase } from './use-case';

export async function buildUseCase(): Promise<ResendEmailConfirmationUseCase> {
  const query = new PrismaResendEmailConfirmationQuery(prisma);
  const mutation = new PrismaResendEmailConfirmationMutation(prisma);
  const otpService = new HotpOtpService();
  const emailQueueService = new BullEmailQueueService();

  return new ResendEmailConfirmationUseCase(
    query,
    mutation,
    otpService,
    emailQueueService
  );
}
