import type { User } from '@entities/user';
import { InputValidationError } from '@errors/input-validation-error';
import { MockOtpService } from '@services/otp/mock';
import { InvalidCodeError, UserNotFoundError } from '../errors';
import type { ConfirmEmailMutation } from '../mutation';
import type { ConfirmEmailQuery } from '../query';
import { SuccessOutput, ConfirmEmailUseCase } from '../use-case';
import { input, output } from './fixtures/dtos';
import { getUser } from './fixtures/query';

class MockConfirmEmailQuery implements ConfirmEmailQuery {
  getUser = jest.fn(async (_email: string): Promise<User | null> => getUser);
}

class MockConfirmEmailMutation implements ConfirmEmailMutation {
  confirmUser = jest.fn(async (_id: string): Promise<void> => undefined);
}

const query = new MockConfirmEmailQuery();
const mutation = new MockConfirmEmailMutation();

async function buildUseCase() {
  const otpService = new MockOtpService();

  return new ConfirmEmailUseCase(query, mutation, otpService);
}

describe('ConfirmEmailUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    query.getUser.mockResolvedValueOnce(getUser);
    mutation.confirmUser.mockResolvedValueOnce(undefined);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });

  it('should fail with InputValidationError when input is invalid', async () => {
    const useCase = await buildUseCase();
    const result = await useCase.run({
      ...input,
      email: 'invalid_email',
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InputValidationError);
  });

  it('should fail with UserNotFoundError when user not found', async () => {
    query.getUser.mockResolvedValueOnce(null);
    mutation.confirmUser.mockResolvedValueOnce(undefined);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should fail with InvalidCodeError when code is invalid', async () => {
    query.getUser.mockResolvedValueOnce(getUser);
    mutation.confirmUser.mockResolvedValueOnce(undefined);

    const useCase = await buildUseCase();
    const result = await useCase.run({
      ...input,
      code: 'invalid_code',
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCodeError);
  });
});
