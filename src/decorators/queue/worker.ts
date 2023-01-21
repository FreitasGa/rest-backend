/* eslint-disable @typescript-eslint/ban-types */
import { Worker, ConnectionOptions } from 'bullmq';
import config from 'config';

import type { Queue } from '@services/queue';

export function BullWorker(queue: Queue): ClassDecorator {
  return function (target: Function) {
    const jobs = Reflect.getMetadata('bull:jobs', target.prototype) || [];

    const connection: ConnectionOptions = {
      host: config.get('queue.host'),
      port: config.get('queue.port'),
      password: config.get('queue.password'),
    };

    new Worker(
      queue,
      async (currentJob) => {
        for (const job of jobs) {
          if (!job.name || job.name === currentJob.name) {
            await target.prototype[job.method](currentJob);
          }
        }
      },
      { connection }
    );
  };
}
