import type { User } from '@entities/user';
import { InputValidationError } from '@errors/input-validation-error';
import { MockHashService } from '@services/hash/mock';
import { MockOtpService } from '@services/otp/mock';
import { InvalidCodeError, UserNotFoundError } from '../errors';
import type {
  ChangePasswordInput,
  ConfirmForgotPasswordRepository,
} from '../repository';
import { ConfirmForgotPasswordUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { changePassword, getUser } from './fixtures/repository';

class MockConfirmForgotPasswordRepository
  implements ConfirmForgotPasswordRepository
{
  changePassword = jest.fn(
    async (_input: ChangePasswordInput): Promise<void> => changePassword
  );
  getUser = jest.fn(async (_email: string): Promise<User | null> => getUser);
}

const repository = new MockConfirmForgotPasswordRepository();

function buildUseCase(): ConfirmForgotPasswordUseCase {
  const hashService = new MockHashService();
  const otpService = new MockOtpService();

  return new ConfirmForgotPasswordUseCase(repository, hashService, otpService);
}

describe('ConfirmForgotPasswordUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    repository.changePassword.mockResolvedValueOnce(changePassword);
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
      code: '123456',
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InputValidationError);
  });

  it('should fail with UserNotFoundError when user is not found', async () => {
    repository.changePassword.mockResolvedValueOnce(changePassword);
    repository.getUser.mockResolvedValueOnce(null);

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should fail with InvalidCodeError when code is invalid', async () => {
    repository.changePassword.mockResolvedValueOnce(changePassword);
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
