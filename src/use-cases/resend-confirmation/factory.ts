import { prisma } from '@modules/database';
import { MockEmailService } from '@services/email/mock';
import { HotpOtpService } from '@services/otp/external';
import { PrismaResendConfirmationMutation } from './mutation';
import { PrismaResendConfirmationQuery } from './query';
import { ResendConfirmationUseCase } from './use-case';

export async function buildUseCase(): Promise<ResendConfirmationUseCase> {
  const query = new PrismaResendConfirmationQuery(prisma);
  const mutation = new PrismaResendConfirmationMutation(prisma);
  const otpService = new HotpOtpService();
  const emailService = new MockEmailService(); // TODO: change to real email service

  return new ResendConfirmationUseCase(
    query,
    mutation,
    otpService,
    emailService
  );
}
