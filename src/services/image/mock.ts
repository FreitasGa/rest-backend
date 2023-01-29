import type { Format, ImageService, ResizeOptions } from './service';

export class MockImageService implements ImageService {
  async resize(file: Core.File, options: ResizeOptions): Promise<Core.File> {
    const [name] = file.originalName.split('.');
    const fileName = `${name}-${options.height}.${options.format}`;

    return {
      originalName: fileName,
      mimeType: file.mimeType,
      size: file.size,
      buffer: file.buffer,
    };
  }
  async format(file: Core.File, format: Format): Promise<Core.File> {
    const [name] = file.originalName.split('.');
    const fileName = `${name}.${format}`;

    return {
      originalName: fileName,
      mimeType: file.mimeType,
      size: file.size,
      buffer: file.buffer,
    };
  }
}
