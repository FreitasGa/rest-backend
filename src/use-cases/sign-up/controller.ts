import {
  Controller as OvernightController,
  Post as OvernightPost,
} from '@overnightjs/core';
import type { Request, Response } from 'express';

import { Controller } from '@core/controller';
import { ApplicationError } from '@errors/application-error';
import type { SignUpInputDto } from './dtos';
import type * as errors from './errors';
import { buildSignUpUseCase } from './factory';
import type { FailureOutput, SuccessOutput } from './use-case';

type ErrorTypes = keyof typeof errors | 'InputValidationError' | 'UnknownError';

@OvernightController('sign-up')
export class SignUpController extends Controller<FailureOutput, SuccessOutput> {
  @OvernightPost()
  async handle(
    req: Request,
    res: Response
  ): Promise<SuccessOutput | FailureOutput | undefined> {
    const useCase = await buildSignUpUseCase();
    const result = await useCase.run(req.body as SignUpInputDto);

    if (result.isWrong()) {
      const error = result.value;

      const errorMap = this.getErrorMap<ErrorTypes>({
        InputValidationError: this.badRequest,
        UnknownError: this.internalServerError,
        InvalidCredentialsError: this.unprocessableEntity,
      });

      const treatment = errorMap[error.constructor.name as ErrorTypes];

      if (!treatment) {
        throw new ApplicationError('Unexpected error.');
      }

      return treatment.bind(this)(req, res, result);
    }

    return this.ok(req, res, result);
  }
}
