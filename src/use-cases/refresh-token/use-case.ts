import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { TokenService } from '@services/token/service';
import type { RefreshTokenInput, RefreshTokenOutput } from './dtos';
import { UserNotFoundError } from './errors';
import type { RefreshTokenRepository } from './repository';

export type Input = RefreshTokenInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = RefreshTokenOutput;

export class RefreshTokenUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly repository: RefreshTokenRepository,
    private readonly tokenService: TokenService
  ) {
    super();
  }

  protected validate(input: Input): Either<InputValidationError, void> {
    if (!input.refreshToken || typeof input.refreshToken !== 'string') {
      return wrong(new InputValidationError());
    }

    return right(undefined);
  }

  protected async execute(
    input: Input
  ): Promise<Either<FailureOutput, SuccessOutput>> {
    const payload = this.tokenService.verify(input.refreshToken);

    const user = await this.repository.getUser(payload.sub);

    if (!user) {
      return wrong(new UserNotFoundError());
    }

    const accessToken = this.tokenService.sign('AccessToken', {
      sub: user.id,
    });

    const idToken = this.tokenService.sign('IdToken', {
      sub: user.id,
      name: user.name,
      email: user.email,
    });

    const refreshToken = this.tokenService.sign('RefreshToken', {
      sub: user.id,
    });

    return right({
      accessToken,
      idToken,
      refreshToken,
    });
  }
}
