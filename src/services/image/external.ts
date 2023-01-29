import sharp from 'sharp';

import type { Format, ImageService, ResizeOptions } from './service';

export class SharpImageService implements ImageService {
  async resize(file: Core.File, options: ResizeOptions): Promise<Core.File> {
    const buffer = await sharp(file.buffer)
      .resize({
        width: options.width,
        height: options.height,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .toFormat(options.format, { quality: options.quality })
      .toBuffer();

    const [name] = file.originalName.split('.');
    const fileName = `${name}-${options.height}.${options.format}`;

    return {
      originalName: fileName,
      mimeType: `image/${options.format}`,
      size: buffer.byteLength,
      buffer,
    };
  }

  async format(file: Core.File, format: Format): Promise<Core.File> {
    const buffer = await sharp(file.buffer).toFormat(format).toBuffer();

    const [name] = file.originalName.split('.');
    const fileName = `${name}.${format}`;

    return {
      originalName: fileName,
      mimeType: `image/${format}`,
      size: buffer.byteLength,
      buffer,
    };
  }
}
