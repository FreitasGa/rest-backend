import { prisma } from '@modules/database';
import { JwtTokenService } from '@services/token/external';
import { PrismaRefreshTokenRepository } from './repository';
import { RefreshTokenUseCase } from './use-case';

export function buildUseCase(): RefreshTokenUseCase {
  const repository = new PrismaRefreshTokenRepository(prisma);
  const tokenService = new JwtTokenService();

  return new RefreshTokenUseCase(repository, tokenService);
}
