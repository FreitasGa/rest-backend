import { prisma } from '@modules/database';
import { HotpOtpService } from '@services/otp/external';
import { PrismaValidateEmailMutation } from './mutation';
import { PrismaValidateEmailQuery } from './query';
import { ValidateEmailUseCase } from './use-case';

export async function buildValidateEmail(): Promise<ValidateEmailUseCase> {
  const query = new PrismaValidateEmailQuery(prisma);
  const mutation = new PrismaValidateEmailMutation(prisma);
  const optService = new HotpOtpService();

  return new ValidateEmailUseCase(query, mutation, optService);
}
