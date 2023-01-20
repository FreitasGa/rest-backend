import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { HashService } from '@services/hash/service';
import type { OtpService } from '@services/otp/service';
import type { EmailQueueService } from '@services/queue/email/service';
import type { SignUpInput, SignUpOutput } from './dtos';
import { InvalidCredentialsError } from './errors';
import type { SignUpRepository } from './repository';

export type Input = SignUpInput;
export type FailureOutput = BusinessError | UnknownError | ApplicationError;
export type SuccessOutput = SignUpOutput;

export class SignUpUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly repository: SignUpRepository,
    private readonly hashService: HashService,
    private readonly otpService: OtpService,
    private readonly emailQueueService: EmailQueueService
  ) {
    super();
  }

  protected validate(input: Input): Either<InputValidationError, void> {
    if (
      !input.name ||
      !input.email ||
      !input.password ||
      typeof input.name !== 'string' ||
      typeof input.email !== 'string' ||
      typeof input.password !== 'string'
    ) {
      return wrong(new InputValidationError());
    }

    const emilRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emilRegex.test(input.email) || !passwordRegex.test(input.password)) {
      return wrong(new InputValidationError());
    }

    return right(undefined);
  }

  protected async execute(
    input: Input
  ): Promise<Either<FailureOutput, SuccessOutput>> {
    const userExists = await this.repository.userExists(input.email);

    if (userExists) {
      return wrong(new InvalidCredentialsError());
    }

    const hashedPassword = await this.hashService.hash(input.password);

    const user = await this.repository.createUser({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    const code = this.otpService.generate(user.secret);

    await this.emailQueueService.add('ConfirmEmail', {
      to: user.email,
      data: {
        code,
        name: user.name,
      },
    });

    return right(undefined);
  }
}
