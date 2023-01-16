import { prisma } from '@modules/database';
import { BcryptHashService } from '@services/hash/external';
import { HotpOtpService } from '@services/otp/external';
import { BullEmailQueueService } from '@services/queue/email/external';
import { PrismaSignUpMutation } from './mutation';
import { PrismaSignUpQuery } from './query';
import { SignUpUseCase } from './use-case';

export async function buildUseCase(): Promise<SignUpUseCase> {
  const query = new PrismaSignUpQuery(prisma);
  const mutation = new PrismaSignUpMutation(prisma);
  const hashService = new BcryptHashService();
  const optService = new HotpOtpService();
  const emailQueueService = new BullEmailQueueService();

  return new SignUpUseCase(
    query,
    mutation,
    hashService,
    optService,
    emailQueueService
  );
}
