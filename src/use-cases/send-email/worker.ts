import type { Job } from 'bullmq';

import { Worker } from '@core/worker';
import { BullJob } from '@decorators/queue/job';
import { BullWorker } from '@decorators/queue/worker';
import { buildUseCase } from './factory';
import type { FailureOutput, Input, SuccessOutput } from './use-case';

@BullWorker('EmailTransactionQueue')
export class SendEmailWorker extends Worker<FailureOutput, SuccessOutput> {
  @BullJob()
  async handle(job: Job): Promise<SuccessOutput | FailureOutput | undefined> {
    const useCase = buildUseCase();
    const result = await useCase.run(job.data as Input);

    if (result.isWrong()) {
      const error = result.value;

      return this.failure(job, error);
    }

    return this.success(job, result);
  }
}
