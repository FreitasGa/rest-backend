import { Controller as OvernightController, Get } from '@overnightjs/core';
import type { Request, Response } from 'express';

import { Controller } from '@core/controller';
import type { FailureOutput, SuccessOutput } from './use-case';
import { buildUseCase } from './factory';

type ErrorTypes = 'UnknownError';

@OvernightController('health')
export class HealthController extends Controller<FailureOutput, SuccessOutput> {
  @Get()
  async handle(
    req: Request,
    res: Response
  ): Promise<SuccessOutput | FailureOutput | undefined> {
    const useCase = buildUseCase();
    const result = await useCase.run();

    if (result.isWrong()) {
      const error = result.value;

      const errorMap = this.mapError<ErrorTypes>({
        UnknownError: this.internalServerError,
      });

      const treatment = errorMap[error.constructor.name as ErrorTypes];

      if (!treatment) {
        throw new Error('Error not treated in use case.');
      }

      return treatment.bind(this)(req, res, result);
    }

    return this.ok(req, res, result);
  }
}
