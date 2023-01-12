import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { HashService } from '@services/hash/service';
import type { TokenService } from '@services/token/service';
import type { SignInInput, SignInOutput } from './dtos';
import { InvalidCredentialsError } from './errors';
import type { SingInQuery } from './query';

export type Input = SignInInput;
export type FailureOutput = BusinessError | UnknownError | ApplicationError;
export type SuccessOutput = SignInOutput;

export class SignInUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly query: SingInQuery,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService
  ) {
    super();
  }

  protected validate(input: Input): Either<InputValidationError, void> {
    if (
      !input.email ||
      !input.password ||
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
    const user = await this.query.getUser(input.email);

    if (!user) {
      return wrong(new InvalidCredentialsError());
    }

    if (user.blockedTill && user.blockedTill > new Date()) {
      return wrong(new InvalidCredentialsError());
    }

    const isValidPassword = await this.hashService.compare(
      input.password,
      user.password
    );

    if (!isValidPassword) {
      return wrong(new InvalidCredentialsError());
    }

    const accessToken = this.tokenService.sign('AccessToken', {
      sub: user.id,
    });

    const idToken = this.tokenService.sign('IdToken', {
      sub: user.id,
      name: user.name,
      email: user.email,
      confirmed: user.confirmed,
    });

    const refreshToken = this.tokenService.sign('RefreshToken', {
      sub: user.id,
    });

    return right({
      accessToken,
      refreshToken,
      idToken,
    });
  }
}
