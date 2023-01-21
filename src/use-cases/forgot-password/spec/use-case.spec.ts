import type { User } from '@entities/user';
import { InputValidationError } from '@errors/input-validation-error';
import { MockOtpService } from '@services/otp/mock';
import { MockEmailQueueService } from '@services/queue/email/mock';
import { UserNotFoundError } from '../errors';
import type { ForgotPasswordRepository } from '../repository';
import { ForgotPasswordUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { getUser } from './fixtures/repository';

class MockForgotPasswordRepository implements ForgotPasswordRepository {
  getUser = jest.fn(async (_email: string): Promise<User | null> => getUser);
}

const repository = new MockForgotPasswordRepository();

function buildUseCase(): ForgotPasswordUseCase {
  const otpService = new MockOtpService();
  const emailQueueService = new MockEmailQueueService();

  return new ForgotPasswordUseCase(repository, otpService, emailQueueService);
}

describe('ForgotPasswordUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    repository.getUser.mockResolvedValueOnce(getUser);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });

  it('should fail with InputValidationError when input is invalid', async () => {
    const useCase = await buildUseCase();
    const result = await useCase.run({
      email: 'invalid_email',
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InputValidationError);
  });

  it('should fail with UserNotFoundError when user not found', async () => {
    repository.getUser.mockResolvedValueOnce(null);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
