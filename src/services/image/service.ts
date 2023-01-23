import type { File } from '@utils/file';

const Format = {
  JPEG: 'jpeg',
  PNG: 'png',
  WEBP: 'webp',
} as const;

export type Format = (typeof Format)[keyof typeof Format];

export type ResizeOptions = {
  width: number;
  height: number;
  format: Format;
  quality: number;
};

export interface ImageService {
  resize(file: File, options: ResizeOptions): Promise<File>;
  format(file: File, format: Format): Promise<File>;
}
