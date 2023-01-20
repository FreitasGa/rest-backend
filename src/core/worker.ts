/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
export type Data = any;

export abstract class Worker {
  abstract handle(data: Data): Promise<void>;
}
