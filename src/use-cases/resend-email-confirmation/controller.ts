import {
  Controller as OvernightController,
  Post as OvernightPost,
} from '@overnightjs/core';
import type { Request, Response } from 'express';

import { Controller } from '@core/controller';
import { ApplicationError } from '@errors/application-error';
import type * as errors from './errors';
import { buildUseCase } from './factory';
import type { FailureOutput, Input, SuccessOutput } from './use-case';

type ErrorTypes = keyof typeof errors | 'InputValidationError' | 'UnknownError';

@OvernightController('confirm-email/resend')
export class ResendEmailConfirmationController extends Controller<
  FailureOutput,
  SuccessOutput
> {
  @OvernightPost()
  async handle(
    req: Request,
    res: Response
  ): Promise<SuccessOutput | FailureOutput | undefined> {
    const useCase = await buildUseCase();
    const result = await useCase.run(req.body as Input);

    if (result.isWrong()) {
      const error = result.value;

      const errorMap = this.getErrorMap<ErrorTypes>({
        InputValidationError: this.badRequest,
        UnknownError: this.internalServerError,
        UserNotFoundError: this.unprocessableEntity,
        UserAlreadyConfirmedError: this.unprocessableEntity,
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
