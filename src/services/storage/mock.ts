import { v4 as uuid } from 'uuid';

import type { File } from '@utils/file';
import type { Bucket, StorageService } from './service';

export class MockStorageService implements StorageService {
  private readonly file: File = {
    originalName: 'mocked_file',
    mimeType: 'image/jpeg',
    size: 0,
    buffer: Buffer.from(''),
  };

  async put(bucket: Bucket, path: string, file: File): Promise<string> {
    const [, extension] = file.originalName.split('.');
    const key = `${path}/${uuid()}.${extension}`;

    console.info(`Adding file`, JSON.stringify({ bucket, key, file }));

    return key;
  }

  async get(_bucket: Bucket, _key: string): Promise<File> {
    return this.file;
  }

  async delete(bucket: Bucket, key: string): Promise<void> {
    console.info(`Deleting file`, JSON.stringify({ bucket, key }));
  }

  async url(bucket: Bucket, key: string): Promise<string> {
    return `http://localhost:3000/${bucket}/${key}`;
  }
}
