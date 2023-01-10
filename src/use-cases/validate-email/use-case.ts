import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { OtpService } from '@services/otp/service';
import type { ValidateEmailInput, ValidateEmailOutput } from './dtos';
import { InvalidCodeError, UserNotFoundError } from './errors';
import type { ValidateEmailMutation } from './mutation';
import type { ValidateEmailQuery } from './query';

export type Input = ValidateEmailInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = ValidateEmailOutput;

export class ValidateEmailUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly query: ValidateEmailQuery,
    private readonly mutation: ValidateEmailMutation,
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
    const user = await this.query.getUser(input.email);

    if (!user) {
      return wrong(new UserNotFoundError());
    }

    const isCodeValid = this.otpService.checkCode(
      input.code,
      user.secret,
      user.counter
    );

    if (!isCodeValid) {
      return wrong(new InvalidCodeError());
    }

    await this.mutation.confirmUser(user.id);

    return right(undefined);
  }
}
