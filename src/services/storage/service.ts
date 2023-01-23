import type { File } from '@utils/file';

const Bucket = {
  Public: 'rest-public',
  Private: 'rest-private',
} as const;

export type Bucket = (typeof Bucket)[keyof typeof Bucket];

export type PutOptions = {
  key: string;
};

export interface StorageService {
  put(
    bucket: Bucket,
    path: string,
    file: File,
    options?: PutOptions
  ): Promise<string>;
  get(bucket: Bucket, key: string): Promise<File>;
  delete(bucket: Bucket, key: string): Promise<void>;
  url(bucket: Bucket, key: string): Promise<string>;
}
