import {
  ClassMiddleware,
  Controller as OvernightController,
  Post,
} from '@overnightjs/core';
import type { Request, Response } from 'express';

import { Controller } from '@core/controller';
import { ApplicationError } from '@errors/application-error';
import { AuthMiddleware } from '@middlewares/auth/middlewares';
import { SingleUploadMiddleware } from '@middlewares/upload/middlewares';
import { convertMulterFile } from '@utils/file';
import type * as errors from './errors';
import { buildUseCase } from './factory';
import type { FailureOutput, SuccessOutput } from './use-case';

type ErrorTypes = keyof typeof errors | 'InputValidationError' | 'UnknownError';

@OvernightController('user/avatar')
@ClassMiddleware([AuthMiddleware, SingleUploadMiddleware('avatar')])
export class UploadUserAvatarController extends Controller<
  FailureOutput,
  SuccessOutput
> {
  @Post()
  async handle(
    req: Request,
    res: Response
  ): Promise<SuccessOutput | FailureOutput | undefined> {
    const file = convertMulterFile(req.file!);

    const useCase = buildUseCase();
    const result = await useCase.run({
      userId: req.userId!,
      avatar: file,
    });

    if (result.isWrong()) {
      const error = result.value;

      const errorMap = this.getErrorMap<ErrorTypes>({
        InputValidationError: this.badRequest,
        UnknownError: this.internalServerError,
        UserNotFoundError: this.unprocessableEntity,
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
