/* eslint-disable @typescript-eslint/ban-types */
export function CronJob(): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const jobs = Reflect.getMetadata('cron:jobs', target) || [];
    jobs.push({ method: propertyKey });
    Reflect.defineMetadata('cron:jobs', jobs, target);
  };
}
