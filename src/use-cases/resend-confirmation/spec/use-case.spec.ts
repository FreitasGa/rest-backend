import type { User } from '@entities/user';
import { InputValidationError } from '@errors/input-validation-error';
import { MockEmailService } from '@services/email/mock';
import { MockOtpService } from '@services/otp/mock';
import { UserNotFoundError } from '../errors';
import type { ResendConfirmationMutation } from '../mutation';
import type { ResendConfirmationQuery } from '../query';
import { ResendConfirmationUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { incrementUserCounterById } from './fixtures/mutation';
import { getUserByEmail } from './fixtures/query';

class MockResendConfirmationQuery implements ResendConfirmationQuery {
  getUserByEmail = jest.fn(
    async (_email: string): Promise<User | null> => getUserByEmail
  );
}

class MockResendConfirmationMutation implements ResendConfirmationMutation {
  incrementUserCounterById = jest.fn(
    async (_id: string): Promise<User> => incrementUserCounterById
  );
}

const query = new MockResendConfirmationQuery();
const mutation = new MockResendConfirmationMutation();

async function buildUseCase() {
  const otpService = new MockOtpService();
  const emailService = new MockEmailService();

  return new ResendConfirmationUseCase(
    query,
    mutation,
    otpService,
    emailService
  );
}

describe('ResendConfirmationUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    query.getUserByEmail.mockResolvedValueOnce(getUserByEmail);
    mutation.incrementUserCounterById.mockResolvedValueOnce(
      incrementUserCounterById
    );

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
    query.getUserByEmail.mockResolvedValueOnce(null);
    mutation.incrementUserCounterById.mockResolvedValueOnce(
      incrementUserCounterById
    );

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
