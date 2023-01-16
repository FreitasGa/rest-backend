/* eslint-disable @typescript-eslint/ban-types */
export function Job(name?: string): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const metadata = Reflect.getMetadata('bull:jobs', target) || [];
    metadata.push({ name, method: propertyKey });
    Reflect.defineMetadata('bull:jobs', metadata, target);
  };
}
