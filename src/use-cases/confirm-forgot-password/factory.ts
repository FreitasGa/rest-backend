import { prisma } from '@modules/database';
import { BcryptHashService } from '@services/hash/external';
import { HotpOtpService } from '@services/otp/external';
import { PrismaConfirmForgotPasswordRepository } from './repository';
import { ConfirmForgotPasswordUseCase } from './use-case';

export function buildUseCase(): ConfirmForgotPasswordUseCase {
  const repository = new PrismaConfirmForgotPasswordRepository(prisma);
  const hashService = new BcryptHashService();
  const otpService = new HotpOtpService();

  return new ConfirmForgotPasswordUseCase(repository, hashService, otpService);
}
