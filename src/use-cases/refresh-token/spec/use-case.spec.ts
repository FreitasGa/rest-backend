import type { User } from '@entities/user';
import { MockTokenService } from '@services/token/mock';
import { UserNotFoundError } from '../errors';
import type { RefreshTokenQuery } from '../query';
import { RefreshTokenUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { getUser } from './fixtures/query';

class MockRefreshTokenQuery implements RefreshTokenQuery {
  getUser = jest.fn(async (_id: string): Promise<User | null> => getUser);
}

const query = new MockRefreshTokenQuery();

async function buildUseCase() {
  const tokenService = new MockTokenService();

  return new RefreshTokenUseCase(query, tokenService);
}

describe('RefreshTokenUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    query.getUser.mockResolvedValueOnce(getUser);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });

  it('should fail with UserNotFoundError when user not found', async () => {
    query.getUser.mockResolvedValueOnce(null);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
