import type { User } from '@entities/user';
import { InputValidationError } from '@errors/input-validation-error';
import { MockOtpService } from '@services/otp/mock';
import { InvalidCodeError, UserNotFoundError } from '../errors';
import type { ConfirmEmailRepository } from '../repository';
import { ConfirmEmailUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { confirmUser, getUser } from './fixtures/repository';

class MockConfirmEmailRepository implements ConfirmEmailRepository {
  confirmUser = jest.fn(async (_id: string): Promise<void> => confirmUser);
  getUser = jest.fn(async (_email: string): Promise<User | null> => getUser);
}

const repository = new MockConfirmEmailRepository();

function buildUseCase(): ConfirmEmailUseCase {
  const otpService = new MockOtpService();

  return new ConfirmEmailUseCase(repository, otpService);
}

describe('ConfirmEmailUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    repository.confirmUser.mockResolvedValueOnce(confirmUser);
    repository.getUser.mockResolvedValueOnce(getUser);

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });

  it('should fail with InputValidationError when input is invalid', async () => {
    const useCase = buildUseCase();
    const result = await useCase.run({
      ...input,
      email: 'invalid_email',
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InputValidationError);
  });

  it('should fail with UserNotFoundError when user not found', async () => {
    repository.confirmUser.mockResolvedValueOnce(confirmUser);
    repository.getUser.mockResolvedValueOnce(null);

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should fail with InvalidCodeError when code is invalid', async () => {
    repository.confirmUser.mockResolvedValueOnce(confirmUser);
    repository.getUser.mockResolvedValueOnce(getUser);

    const useCase = buildUseCase();
    const result = await useCase.run({
      ...input,
      code: 'invalid_code',
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCodeError);
  });
});
