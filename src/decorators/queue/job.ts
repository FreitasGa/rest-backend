/* eslint-disable @typescript-eslint/ban-types */
export function BullJob(name?: string): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const jobs = Reflect.getMetadata('bull:jobs', target) || [];
    jobs.push({ name, method: propertyKey });
    Reflect.defineMetadata('bull:jobs', jobs, target);
  };
}
