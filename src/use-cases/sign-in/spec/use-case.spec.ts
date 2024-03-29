import { addDays } from 'date-fns';

import type { User } from '@entities/user';
import { InputValidationError } from '@errors/input-validation-error';
import { MockHashService } from '@services/hash/mock';
import { MockTokenService } from '@services/token/mock';
import { InvalidCredentialsError } from '../errors';
import type { SingInRepository } from '../repository';
import { SignInUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { getUser } from './fixtures/repository';

class MockSignInRepository implements SingInRepository {
  getUser = jest.fn(async (_email: string): Promise<User | null> => getUser);
}

const repository = new MockSignInRepository();

function buildUseCase(): SignInUseCase {
  const hashService = new MockHashService();
  const tokenService = new MockTokenService();

  return new SignInUseCase(repository, hashService, tokenService);
}

describe('SignInUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    repository.getUser.mockResolvedValueOnce(getUser);

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });

  it('should fail with InputValidationError when input is invalid', async () => {
    const useCase = buildUseCase();
    const result = await useCase.run({
      email: 'invalid_email',
      password: 'invalid_password',
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InputValidationError);
  });

  it('should fail with InvalidCredentialsError when user not found', async () => {
    repository.getUser.mockResolvedValueOnce(null);

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should fail with InvalidCredentialsError when user is blocked', async () => {
    repository.getUser.mockResolvedValueOnce({
      ...getUser,
      blockedTill: addDays(new Date(), 1),
    });

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should fail with InvalidCredentialsError when password is invalid', async () => {
    repository.getUser.mockResolvedValueOnce(getUser);

    const useCase = buildUseCase();
    const result = await useCase.run({
      ...input,
      password: 'invalidPassw0rd!',
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
