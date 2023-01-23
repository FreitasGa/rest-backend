import { Queue as BullQueue } from 'bullmq';
import config from 'config';

import { Queue } from '..';
import {
  Data,
  EmailQueueService,
  getTemplate,
  Job,
  QueueData,
} from './service';

export class BullEmailQueueService implements EmailQueueService {
  private readonly queue: BullQueue<QueueData>;

  constructor() {
    this.queue = new BullQueue<QueueData>(Queue.Email, {
      connection: {
        host: config.get('queue.host'),
        port: config.get('queue.port'),
        password: config.get('queue.password'),
      },
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: config.get('queue.email.options.attempts'),
        backoff: {
          type: 'exponential',
          delay: config.get('queue.email.options.delay'),
        },
      },
    });
  }

  async add<EmailJob extends Job, EmailData extends Data[EmailJob]>(
    job: EmailJob,
    data: EmailData
  ): Promise<void> {
    const template = getTemplate(job);

    await this.queue.add(job, {
      template,
      options: data,
    });
  }
}
