import type { User } from '@entities/user';
import { InputValidationError } from '@errors/input-validation-error';
import { MockEmailService } from '@services/email/mock';
import { MockHashService } from '@services/hash/mock';
import { MockOtpService } from '@services/otp/mock';
import { InvalidCredentialsError } from '../errors';
import type {
  CreateUserInput,
  IncrementUserCounterInput,
  SignUpMutation,
} from '../mutation';
import type { SignUpQuery } from '../query';
import { SignUpUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { createUser, incrementUserCounter } from './fixtures/mutation';
import { userExistsByEmail } from './fixtures/query';

class SignUpQueryMock implements SignUpQuery {
  userExistsByEmail = jest.fn(
    async (_email: string): Promise<boolean> => userExistsByEmail
  );
}

class SignUpMutationMock implements SignUpMutation {
  createUser = jest.fn(
    async (_input: CreateUserInput): Promise<User> => createUser
  );
  incrementUserCounter = jest.fn(
    async (_input: IncrementUserCounterInput): Promise<void> =>
      incrementUserCounter
  );
}

const query = new SignUpQueryMock();
const mutation = new SignUpMutationMock();

async function buildUseCase() {
  const hashService = new MockHashService();
  const otpService = new MockOtpService();
  const emailService = new MockEmailService();

  return new SignUpUseCase(
    query,
    mutation,
    hashService,
    otpService,
    emailService
  );
}

describe('SignUpUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    query.userExistsByEmail.mockResolvedValueOnce(false);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });

  it('should fail with InputValidationError when input is invalid', async () => {
    const useCase = await buildUseCase();
    const result = await useCase.run({
      name: 'name',
      email: 'invalid_email',
      password: 'invalid_password',
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InputValidationError);
  });

  it('should fail with InvalidCredentialsError when user already exists', async () => {
    query.userExistsByEmail.mockResolvedValueOnce(true);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
