import { Either, right } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { HealthInput, HealthOutput } from './dtos';

export type Input = HealthInput;
export type FailureOutput = ApplicationError | UnknownError;
export type SuccessOutput = HealthOutput;

export class HealthUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor() {
    super();
  }

  protected validate(_input: Input): Either<InputValidationError, void> {
    return right(undefined);
  }

  protected async execute(
    _input: Input
  ): Promise<Either<FailureOutput, SuccessOutput>> {
    return right({
      status: 'on',
    });
  }
}
