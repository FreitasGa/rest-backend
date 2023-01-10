import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { EmailService } from '@services/email/service';
import type { OtpService } from '@services/otp/service';
import type { ResendConfirmationInput, ResendConfirmationOutput } from './dtos';
import { UserNotFoundError } from './errors';
import type { ResendConfirmationMutation } from './mutation';
import type { ResendConfirmationQuery } from './query';

export type Input = ResendConfirmationInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = ResendConfirmationOutput;

export class ResendConfirmationUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly query: ResendConfirmationQuery,
    private readonly mutation: ResendConfirmationMutation,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService
  ) {
    super();
  }

  protected validate(input: Input): Either<InputValidationError, void> {
    if (!input.email || typeof input.email !== 'string') {
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
    let user = await this.query.getUser(input.email);

    if (!user) {
      return wrong(new UserNotFoundError());
    }

    user = await this.mutation.incrementUserCounter(user.id);

    const code = this.otpService.generateCode(user.secret, user.counter);

    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Verify your email',
      template: 'verify-email',
      data: {
        code,
        name: user.name,
      },
    });

    return right(undefined);
  }
}
