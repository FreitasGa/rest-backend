import { addDays } from 'date-fns';

import type { User } from '@entities/user';
import { InputValidationError } from '@errors/input-validation-error';
import { MockHashService } from '@services/hash/mock';
import { MockTokenService } from '@services/token/mock';
import { InvalidCredentialsError } from '../errors';
import type { SingInQuery } from '../query';
import { SignInUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { findUserByEmail } from './fixtures/query';

class SignInQueryMock implements SingInQuery {
  findUserByEmail = jest.fn(
    async (_email: string): Promise<User | null> => findUserByEmail
  );
}

const query = new SignInQueryMock();

async function buildUseCase() {
  const hashService = new MockHashService();
  const tokenService = new MockTokenService();

  return new SignInUseCase(query, hashService, tokenService);
}

describe('SignInUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    query.findUserByEmail.mockResolvedValueOnce(findUserByEmail);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });

  it('should fail with InputValidationError when input is invalid', async () => {
    const useCase = await buildUseCase();
    const result = await useCase.run({
      email: 'invalid_email',
      password: 'invalid_password',
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InputValidationError);
  });

  it('should fail with InvalidCredentialsError when user not found', async () => {
    query.findUserByEmail.mockResolvedValueOnce(null);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should fail with InvalidCredentialsError when user is blocked', async () => {
    query.findUserByEmail.mockResolvedValueOnce({
      ...findUserByEmail,
      blockedTill: addDays(new Date(), 1),
    });

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should fail with InvalidCredentialsError when password is invalid', async () => {
    query.findUserByEmail.mockResolvedValueOnce(findUserByEmail);

    const useCase = await buildUseCase();
    const result = await useCase.run({
      ...input,
      password: 'invalidPassw0rd!',
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
