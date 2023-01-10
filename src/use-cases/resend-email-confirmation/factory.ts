import { prisma } from '@modules/database';
import { MockEmailService } from '@services/email/mock';
import { HotpOtpService } from '@services/otp/external';
import { PrismaResendEmailConfirmationMutation } from './mutation';
import { PrismaResendEmailConfirmationQuery } from './query';
import { ResendEmailConfirmationUseCase } from './use-case';

export async function buildUseCase(): Promise<ResendEmailConfirmationUseCase> {
  const query = new PrismaResendEmailConfirmationQuery(prisma);
  const mutation = new PrismaResendEmailConfirmationMutation(prisma);
  const otpService = new HotpOtpService();
  const emailService = new MockEmailService(); // TODO: change to real email service

  return new ResendEmailConfirmationUseCase(
    query,
    mutation,
    otpService,
    emailService
  );
}
