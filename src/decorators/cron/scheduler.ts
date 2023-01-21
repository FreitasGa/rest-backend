/* eslint-disable @typescript-eslint/ban-types */
import { CronJob } from 'cron';

export function CronScheduler(cronTime: string | Date): ClassDecorator {
  return function (target: Function) {
    const jobs = Reflect.getMetadata('cron:jobs', target.prototype) || [];

    new CronJob({
      cronTime,
      onTick: async () => {
        for (const job of jobs) {
          await target.prototype[job.method]();
        }
      },
      start: true,
      timeZone: 'UTC',
    });
  };
}
