import type { Prisma } from '@prisma/client';

import type { File } from '@entities/file';
import type { File as InternalFile } from '@utils/file';

export interface ResizeImageRepository {
  createFile(file: InternalFile, key: string, isPublic: boolean): Promise<File>;
}

export class PrismaResizeImageRepository implements ResizeImageRepository {
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async createFile(
    file: InternalFile,
    key: string,
    isPublic: boolean
  ): Promise<File> {
    return this.prisma.file.create({
      data: {
        key,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        public: isPublic,
      },
    });
  }
}
