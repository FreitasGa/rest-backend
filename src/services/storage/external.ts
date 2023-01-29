import config from 'config';
import { Client as MinioClient } from 'minio';
import { v4 as uuid } from 'uuid';

import type { Bucket, PutOptions, StorageService } from './service';

export class MinioStorageService implements StorageService {
  private readonly client: MinioClient;

  constructor() {
    this.client = new MinioClient({
      endPoint: config.get('storage.host'),
      port: parseInt(config.get('storage.port'), 10),
      accessKey: config.get('storage.user'),
      secretKey: config.get('storage.password'),
      useSSL: false,
    });
  }

  async put(
    bucket: Bucket,
    path: string,
    file: Core.File,
    options?: PutOptions
  ): Promise<string> {
    let key: string;

    if (!options || (options && !options.key)) {
      const [, extension] = file.originalName.split('.');
      key = `${path}/${uuid()}.${extension}`;
    } else {
      key = options.key;
    }

    await this.client.putObject(bucket, key, file.buffer, file.size, {
      'Content-Type': file.mimeType,
      'Original-File-Name': file.originalName,
    });

    return key;
  }

  async get(bucket: Bucket, key: string): Promise<Core.File> {
    const readable = await this.client.getObject(bucket, key);
    const stat = await this.client.statObject(bucket, key);

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];

      readable.on('data', (chunk) => chunks.push(chunk));
      readable.on('end', () => resolve(Buffer.concat(chunks)));
      readable.on('error', reject);
    });

    return {
      originalName: stat.metaData['original-file-name'],
      mimeType: stat.metaData['content-type'],
      size: stat.size,
      buffer,
    };
  }

  async delete(bucket: Bucket, key: string): Promise<void> {
    await this.client.removeObject(bucket, key);
  }

  async url(bucket: Bucket, key: string): Promise<string> {
    const host = config.get('storage.host');
    const port = config.get('storage.port');

    return `${host}:${port}/${bucket}/${key}`;
  }
}
