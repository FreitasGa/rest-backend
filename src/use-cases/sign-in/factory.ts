import { prisma } from '@modules/database';
import { BcryptHashService } from '@services/hash/external';
import { JwtTokenService } from '@services/token/external';
import { PrismaSingInQuery } from './query';
import { SignInUseCase } from './use-case';

export async function buildSignInUseCase(): Promise<SignInUseCase> {
  const query = new PrismaSingInQuery(prisma);
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService();

  return new SignInUseCase(query, hashService, tokenService);
}
