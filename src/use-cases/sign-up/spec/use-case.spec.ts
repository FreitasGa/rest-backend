import type { User } from '@entities/user';
import { InputValidationError } from '@errors/input-validation-error';
import { MockHashService } from '@services/hash/mock';
import { MockOtpService } from '@services/otp/mock';
import { MockEmailQueueService } from '@services/queue/email/mock';
import { InvalidCredentialsError } from '../errors';
import type { CreateUserInput, SignUpRepository } from '../repository';
import { SignUpUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';
import { createUser, userExists } from './fixtures/repository';

class MockSignUpRepository implements SignUpRepository {
  createUser = jest.fn(
    async (_input: CreateUserInput): Promise<User> => createUser
  );
  userExists = jest.fn(async (_email: string): Promise<boolean> => userExists);
}

const repository = new MockSignUpRepository();

function buildUseCase(): SignUpUseCase {
  const hashService = new MockHashService();
  const otpService = new MockOtpService();
  const emailQueueService = new MockEmailQueueService();

  return new SignUpUseCase(
    repository,
    hashService,
    otpService,
    emailQueueService
  );
}

describe('SignUpUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    repository.createUser.mockResolvedValueOnce(createUser);
    repository.userExists.mockResolvedValueOnce(false);

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });

  it('should fail with InputValidationError when input is invalid', async () => {
    const useCase = buildUseCase();
    const result = await useCase.run({
      name: 'name',
      email: 'invalid_email',
      password: 'invalid_password',
    });

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InputValidationError);
  });

  it('should fail with InvalidCredentialsError when user already exists', async () => {
    repository.createUser.mockResolvedValueOnce(createUser);
    repository.userExists.mockResolvedValueOnce(true);

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
