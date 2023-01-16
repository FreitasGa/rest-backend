import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { OtpService } from '@services/otp/service';
import type { EmailQueueService } from '@services/queue/email/service';
import type {
  ResendEmailConfirmationInput,
  ResendEmailConfirmationOutput,
} from './dtos';
import { UserAlreadyConfirmedError, UserNotFoundError } from './errors';
import type { ResendEmailConfirmationMutation } from './mutation';
import type { ResendEmailConfirmationQuery } from './query';

export type Input = ResendEmailConfirmationInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = ResendEmailConfirmationOutput;

export class ResendEmailConfirmationUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly query: ResendEmailConfirmationQuery,
    private readonly mutation: ResendEmailConfirmationMutation,
    private readonly otpService: OtpService,
    private readonly emailQueueService: EmailQueueService
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

    if (user.confirmed) {
      return wrong(new UserAlreadyConfirmedError());
    }

    user = await this.mutation.incrementUserCounter(user.id);

    const code = this.otpService.generate(user.secret, user.counter);

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
