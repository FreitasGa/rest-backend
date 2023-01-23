import { Queue as BullQueue } from 'bullmq';
import config from 'config';

import { Queue } from '..';
import type { Data, FileQueueService, Job, QueueData } from './service';

export class BullFileQueueService implements FileQueueService {
  private readonly queue: BullQueue<QueueData>;

  constructor() {
    this.queue = new BullQueue<QueueData>(Queue.File, {
      connection: {
        host: config.get('queue.host'),
        port: config.get('queue.port'),
        password: config.get('queue.password'),
      },
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: config.get('queue.file.options.attempts'),
        backoff: {
          type: 'exponential',
          delay: config.get('queue.file.options.delay'),
        },
      },
    });
  }

  async add<FileJob extends Job, FileData extends Data[FileJob]>(
    job: FileJob,
    data: FileData
  ): Promise<void> {
    await this.queue.add(job, data);
  }
}
