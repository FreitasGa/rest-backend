/* eslint-disable @typescript-eslint/ban-types */
import { Worker } from 'bullmq';
import config from 'config';

import type { Queue } from '@services/queue';

export function BullWorker(queue: Queue): ClassDecorator {
  return function (target: Function) {
    const metadata = Reflect.getMetadata('bull:jobs', target.prototype) || [];
    new Worker(
      queue,
      async (job) => {
        for (const jobMetadata of metadata) {
          if (!jobMetadata.name || jobMetadata.name === job.name) {
            await target.prototype[jobMetadata.method](job.data);
          }
        }
      },
      {
        connection: {
          host: config.get('queue.host'),
          port: config.get('queue.port'),
          password: config.get('queue.password'),
        },
      }
    );
  };
}
