import type { InputValidationError } from '@errors/input-validation-error';
import { UnknownError } from '@errors/unknown-error';
import { Either, wrong } from './either';

export abstract class UseCase<
  Input,
  FailureOutput extends Error,
  SuccessOutput
> {
  protected abstract validate(input: Input): Either<InputValidationError, void>;

  protected abstract execute(
    input?: Input
  ): Promise<
    Either<FailureOutput | InputValidationError | UnknownError, SuccessOutput>
  >;

  async run(
    input: Input
  ): Promise<
    Either<FailureOutput | InputValidationError | UnknownError, SuccessOutput>
  > {
    try {
      const validation = this.validate(input);

      if (validation.isWrong()) {
        return wrong(validation.value);
      }

      const result = await this.execute(input);
      return result;
    } catch (error) {
      return wrong(new UnknownError(error));
    }
  }
}
