import { prisma } from '@modules/database';
import { MockEmailService } from '@services/email/mock';
import { BcryptHashService } from '@services/hash/external';
import { HotpOtpService } from '@services/otp/external';
import { PrismaSignUpMutation } from './mutation';
import { PrismaSignUpQuery } from './query';
import { SignUpUseCase } from './use-case';

export async function buildUseCase(): Promise<SignUpUseCase> {
  const query = new PrismaSignUpQuery(prisma);
  const mutation = new PrismaSignUpMutation(prisma);
  const hashService = new BcryptHashService();
  const optService = new HotpOtpService();
  const emailService = new MockEmailService(); // TODO: change to real email service

  return new SignUpUseCase(
    query,
    mutation,
    hashService,
    optService,
    emailService
  );
}
