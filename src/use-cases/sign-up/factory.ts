import { prisma } from '@modules/database';
import { BcryptHashService } from '@services/hash/external';
import { HotpOtpService } from '@services/otp/external';
import { BullEmailQueueService } from '@services/queue/email/external';
import { PrismaSignUpRepository } from './repository';
import { SignUpUseCase } from './use-case';

export function buildUseCase(): SignUpUseCase {
  const repository = new PrismaSignUpRepository(prisma);
  const hashService = new BcryptHashService();
  const optService = new HotpOtpService();
  const emailQueueService = new BullEmailQueueService();

  return new SignUpUseCase(
    repository,
    hashService,
    optService,
    emailQueueService
  );
}
