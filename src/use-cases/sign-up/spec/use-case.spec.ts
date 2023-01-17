import type { User } from '@entities/user';
import { InputValidationError } from '@errors/input-validation-error';
import { MockHashService } from '@services/hash/mock';
import { MockOtpService } from '@services/otp/mock';
import { MockEmailQueueService } from '@services/queue/email/mock';
import { InvalidCredentialsError } from '../errors';
import type { CreateUserInput, SignUpMutation } from '../mutation';
import type { SignUpQuery } from '../query';
import { SignUpUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { createUser } from './fixtures/mutation';
import { userExists } from './fixtures/query';

class MockSignUpQuery implements SignUpQuery {
  userExists = jest.fn(async (_email: string): Promise<boolean> => userExists);
}

class MockSignUpMutation implements SignUpMutation {
  createUser = jest.fn(
    async (_input: CreateUserInput): Promise<User> => createUser
  );
}

const query = new MockSignUpQuery();
const mutation = new MockSignUpMutation();

async function buildUseCase() {
  const hashService = new MockHashService();
  const otpService = new MockOtpService();
  const emailQueueService = new MockEmailQueueService();

  return new SignUpUseCase(
    query,
    mutation,
    hashService,
    otpService,
    emailQueueService
  );
}

describe('SignUpUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    query.userExists.mockResolvedValueOnce(false);
    mutation.createUser.mockResolvedValueOnce(createUser);

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
    query.userExists.mockResolvedValueOnce(true);
    mutation.createUser.mockResolvedValueOnce(createUser);

    const useCase = await buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
