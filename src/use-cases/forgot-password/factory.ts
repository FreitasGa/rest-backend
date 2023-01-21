import { prisma } from '@modules/database';
import { HotpOtpService } from '@services/otp/external';
import { BullEmailQueueService } from '@services/queue/email/external';
import { PrismaForgotPasswordRepository } from './repository';
import { ForgotPasswordUseCase } from './use-case';

export function buildUseCase(): ForgotPasswordUseCase {
  const repository = new PrismaForgotPasswordRepository(prisma);
  const otpService = new HotpOtpService();
  const emailQueueService = new BullEmailQueueService();

  return new ForgotPasswordUseCase(repository, otpService, emailQueueService);
}
