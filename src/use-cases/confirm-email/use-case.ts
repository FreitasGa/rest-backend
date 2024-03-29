import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { OtpService } from '@services/otp/service';
import type { ConfirmEmailInput, ConfirmEmailOutput } from './dtos';
import { InvalidCodeError, UserNotFoundError } from './errors';
import type { ConfirmEmailRepository } from './repository';

export type Input = ConfirmEmailInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = ConfirmEmailOutput;

export class ConfirmEmailUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly repository: ConfirmEmailRepository,
    private readonly otpService: OtpService
  ) {
    super();
  }

  protected validate(input: Input): Either<InputValidationError, void> {
    if (
      !input.email ||
      typeof input.email !== 'string' ||
      !input.code ||
      typeof input.code !== 'string'
    ) {
      return wrong(new InputValidationError());
    }

    const emilRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emilRegex.test(input.email)) {
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

    await this.repository.confirmUser(user.id);

    return right(undefined);
  }
}
