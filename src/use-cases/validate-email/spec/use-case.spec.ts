import type { User } from '@entities/user';
import { MockOtpService } from '@services/otp/mock';
import { InvalidCodeError, UserNotFoundError } from '../errors';
import type { ValidateEmailMutation } from '../mutation';
import type { ValidateEmailQuery } from '../query';
import { SuccessOutput, ValidateEmailUseCase } from '../use-case';
import { input, output } from './fixtures/dtos';
import { getUserByEmail } from './fixtures/query';

class ValidateEmailQueryMock implements ValidateEmailQuery {
  getUserByEmail = jest.fn(
    async (_email: string): Promise<User | null> => getUserByEmail
  );
}

class ValidateEmailMutationMock implements ValidateEmailMutation {
  confirmUserById = jest.fn(
    async (_userId: string): Promise<void> => undefined
  );
}

const query = new ValidateEmailQueryMock();
const mutation = new ValidateEmailMutationMock();

async function buildUseCase() {
  const otpService = new MockOtpService();

  return new ValidateEmailUseCase(query, mutation, otpService);
}

describe('ValidateEmailUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    query.getUserByEmail.mockResolvedValueOnce(getUserByEmail);
    mutation.confirmUserById.mockResolvedValueOnce(undefined);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });

  it('should fail with UserNotFoundError when user not found', async () => {
    query.getUserByEmail.mockResolvedValueOnce(null);
    mutation.confirmUserById.mockResolvedValueOnce(undefined);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should fail with InvalidCodeError when code is invalid', async () => {
    query.getUserByEmail.mockResolvedValueOnce(getUserByEmail);
    mutation.confirmUserById.mockResolvedValueOnce(undefined);

    const useCase = await buildUseCase();
    const result = await useCase.run({
      ...input,
      code: 'invalid_code',
    });
    console.log(result);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCodeError);
  });
});
