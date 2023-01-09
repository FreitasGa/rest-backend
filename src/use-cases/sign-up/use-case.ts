import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { EmailService } from '@services/email/service';
import type { HashService } from '@services/hash/service';
import type { OtpService } from '@services/otp/service';
import type { SignUpInputDto, SignUpOutputDto } from './dtos';
import { InvalidCredentialsError } from './errors';
import type { SignUpMutation } from './mutation';
import type { SignUpQuery } from './query';

export type Input = SignUpInputDto;
export type FailureOutput = BusinessError | UnknownError | ApplicationError;
export type SuccessOutput = SignUpOutputDto;

export class SignUpUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly query: SignUpQuery,
    private readonly mutation: SignUpMutation,
    private readonly hashService: HashService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService
  ) {
    super();
  }

  protected validate(input: Input): Either<InputValidationError, void> {
    if (
      !input.name ||
      !input.email ||
      !input.password ||
      typeof input.name !== 'string' ||
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
    const userExists = await this.query.userExistsByEmail(input.email);

    if (userExists) {
      return wrong(new InvalidCredentialsError());
    }

    const hashedPassword = await this.hashService.hash(input.password);

    const user = await this.mutation.createUser({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    await this.mutation.incrementUserCounter({
      userId: user.id,
    });

    const code = this.otpService.generateCode({
      secret: user.secret,
      counter: user.counter,
    });

    await this.emailService.sendEmail({
      to: input.email,
      subject: 'Verify your email',
      template: 'verify-email',
      data: {
        code,
        name: input.name,
      },
    });

    return right(undefined);
  }
}
