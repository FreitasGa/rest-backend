import { Job } from '@decorators/job';
import { Worker } from '@decorators/worker';
import type { SendEmailOptions, Template } from '@services/email/service';
import { buildUseCase } from './factory';

type WorkerData = {
  template: Template;
  options: SendEmailOptions<Template>;
};

@Worker('EmailTransactionQueue')
export class SendEmailWorker {
  @Job()
  async handle(data: WorkerData): Promise<void> {
    const useCase = await buildUseCase();
    await useCase.run(data);
  }
}
