import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { EmailService } from '@services/email/service';
import type { SendEmailInput, SendEmailOutput } from './dtos';

export type Input = SendEmailInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = SendEmailOutput;

export class SendEmailUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  protected validate(input: Input): Either<InputValidationError, void> {
    if (
      !input.template ||
      typeof input.template !== 'string' ||
      !input.options ||
      typeof input.options !== 'object'
    ) {
      return wrong(new InputValidationError());
    }

    return right(undefined);
  }

  protected async execute(
    input: Input
  ): Promise<Either<FailureOutput, SuccessOutput>> {
    await this.emailService.send(input.template, input.options);

    return right(undefined);
  }
}
