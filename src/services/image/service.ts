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
  resize(file: Core.File, options: ResizeOptions): Promise<Core.File>;
  format(file: Core.File, format: Format): Promise<Core.File>;
}
