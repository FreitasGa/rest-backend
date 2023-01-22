import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { HashService } from '@services/hash/service';
import type { OtpService } from '@services/otp/service';
import type {
  ConfirmForgotPasswordInput,
  ConfirmForgotPasswordOutput,
} from './dtos';
import { InvalidCodeError, UserNotFoundError } from './errors';
import type { ConfirmForgotPasswordRepository } from './repository';

export type Input = ConfirmForgotPasswordInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = ConfirmForgotPasswordOutput;

export class ConfirmForgotPasswordUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly repository: ConfirmForgotPasswordRepository,
    private readonly hashService: HashService,
    private readonly otpService: OtpService
  ) {
    super();
  }

  protected validate(input: Input): Either<InputValidationError, void> {
    if (
      !input.email ||
      !input.code ||
      !input.password ||
      typeof input.email !== 'string' ||
      typeof input.code !== 'string' ||
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
    const user = await this.repository.getUser(input.email);

    if (!user) {
      return wrong(new UserNotFoundError());
    }

    const isCodeValid = this.otpService.check(input.code, user.secret);

    if (!isCodeValid) {
      return wrong(new InvalidCodeError());
    }

    const hashedPassword = await this.hashService.hash(input.password);

    await this.repository.changePassword({
      id: user.id,
      password: hashedPassword,
    });

    return right(undefined);
  }
}
