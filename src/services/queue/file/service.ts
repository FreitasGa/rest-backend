import type { Bucket } from '@services/storage/service';

export const Job = {
  GenerateImageSizes: 'GenerateImageSizes',
} as const;

export type Job = (typeof Job)[keyof typeof Job];

export type GenerateImageSizesData = {
  key: string;
  bucket: Bucket;
  sizes: number[];
};

export type Data = {
  [Job.GenerateImageSizes]: GenerateImageSizesData;
};

export type QueueData = Data[Job];

export interface FileQueueService {
  add<FileJob extends Job, FileData extends Data[FileJob]>(
    job: FileJob,
    data: FileData
  ): Promise<void>;
}
