import { prisma } from '@modules/database';
import { BcryptHashService } from '@services/hash/external';
import { JwtTokenService } from '@services/token/external';
import { PrismaSingInRepository } from './repository';
import { SignInUseCase } from './use-case';

export function buildUseCase(): SignInUseCase {
  const repository = new PrismaSingInRepository(prisma);
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService();

  return new SignInUseCase(repository, hashService, tokenService);
}
