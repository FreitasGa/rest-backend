import { prisma } from '@modules/database';
import { JwtTokenService } from '@services/token/external';
import { PrismaRefreshTokenQuery } from './repository';
import { RefreshTokenUseCase } from './use-case';

export async function buildUseCase(): Promise<RefreshTokenUseCase> {
  const query = new PrismaRefreshTokenQuery(prisma);
  const tokenService = new JwtTokenService();

  return new RefreshTokenUseCase(query, tokenService);
}
