import { Data, Worker } from '@core/worker';
import { BullJob } from '@decorators/queue/job';
import { BullWorker } from '@decorators/queue/worker';
import { buildUseCase } from './factory';
import type { Input } from './use-case';

@BullWorker('EmailTransactionQueue')
export class SendEmailWorker extends Worker {
  @BullJob()
  async handle(data: Data): Promise<void> {
    const useCase = await buildUseCase();
    await useCase.run(data as Input);
  }
}
