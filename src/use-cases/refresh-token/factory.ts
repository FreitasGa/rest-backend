import { prisma } from '@modules/database';
import { JwtTokenService } from '@services/token/external';
import { PrismaRefreshTokenQuery } from './query';
import { RefreshTokenUseCase } from './use-case';

export async function buildRefreshTokenUseCase(): Promise<RefreshTokenUseCase> {
  const query = new PrismaRefreshTokenQuery(prisma);
  const tokenService = new JwtTokenService();

  return new RefreshTokenUseCase(query, tokenService);
}
