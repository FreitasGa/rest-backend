import type { User } from '@entities/user';
import { JwtTokenService } from '@services/token/external';
import { UserNotFoundError } from '../errors';
import type { RefreshTokenQuery } from '../query';
import { RefreshTokenUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { findUserById } from './fixtures/query';

class RefreshTokenQueryMock implements RefreshTokenQuery {
  getUserById = jest.fn(
    async (_id: string): Promise<User | null> => findUserById
  );
}

const query = new RefreshTokenQueryMock();

async function buildUseCase() {
  const tokenService = new JwtTokenService();

  return new RefreshTokenUseCase(query, tokenService);
}

describe('RefreshTokenUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    query.getUserById.mockResolvedValueOnce(findUserById);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });

  it('should fail with UserNotFoundError when user not found', async () => {
    query.getUserById.mockResolvedValueOnce(null);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
