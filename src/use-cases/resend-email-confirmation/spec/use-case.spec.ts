import type { User } from '@entities/user';
import { InputValidationError } from '@errors/input-validation-error';
import { MockOtpService } from '@services/otp/mock';
import { MockEmailQueueService } from '@services/queue/email/mock';
import { UserAlreadyConfirmedError, UserNotFoundError } from '../errors';
import type { ResendEmailConfirmationRepository } from '../repository';
import { ResendEmailConfirmationUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { getUser } from './fixtures/repository';

class MockResendEmailConfirmationRepository
  implements ResendEmailConfirmationRepository
{
  getUser = jest.fn(async (_email: string): Promise<User | null> => getUser);
}

const repository = new MockResendEmailConfirmationRepository();

function buildUseCase(): ResendEmailConfirmationUseCase {
  const otpService = new MockOtpService();
  const emailQueueService = new MockEmailQueueService();

  return new ResendEmailConfirmationUseCase(
    repository,
    otpService,
    emailQueueService
  );
}

describe('ResendEmailConfirmationUseCase', () => {
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
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InputValidationError);
  });

  it('should fail with UserNotFoundError when user not found', async () => {
    repository.getUser.mockResolvedValueOnce(null);

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should fail with UserAlreadyConfirmedError when user already confirmed', async () => {
    repository.getUser.mockResolvedValueOnce({ ...getUser, confirmed: true });

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserAlreadyConfirmedError);
  });
});
