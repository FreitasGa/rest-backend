import type { File } from '@utils/file';
import type { Format, ImageService, ResizeOptions } from './service';

export class MockImageService implements ImageService {
  async resize(file: File, options: ResizeOptions): Promise<File> {
    const [name] = file.originalName.split('.');
    const fileName = `${name}-${options.height}.${options.format}`;

    return {
      originalName: fileName,
      mimeType: file.mimeType,
      size: file.size,
      buffer: file.buffer,
    };
  }
  async format(file: File, format: Format): Promise<File> {
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
