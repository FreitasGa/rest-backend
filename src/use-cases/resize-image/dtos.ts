import type { Bucket } from '@services/storage/service';

export type ResizeImageInput = {
  bucket: Bucket;
  key: string;
  sizes: number[];
};

export type ResizeImageOutput = void;
