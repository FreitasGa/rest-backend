import type { User } from '@entities/user';
import { MockTokenService } from '@services/token/mock';
import { UserNotFoundError } from '../errors';
import type { RefreshTokenRepository } from '../repository';
import { RefreshTokenUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { getUser } from './fixtures/repository';

class MockRefreshTokenRepository implements RefreshTokenRepository {
  getUser = jest.fn(async (_id: string): Promise<User | null> => getUser);
}

const repository = new MockRefreshTokenRepository();

function buildUseCase(): RefreshTokenUseCase {
  const tokenService = new MockTokenService();

  return new RefreshTokenUseCase(repository, tokenService);
}

describe('RefreshTokenUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    repository.getUser.mockResolvedValueOnce(getUser);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });

  it('should fail with UserNotFoundError when user not found', async () => {
    repository.getUser.mockResolvedValueOnce(null);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
