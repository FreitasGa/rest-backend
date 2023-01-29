import type { Prisma } from '@prisma/client';

import type { File } from '@entities/file';
import type { User } from '@entities/user';

export interface UploadUserAvatarRepository {
  getUser(id: string): Promise<User | null>;
  createFile(file: Core.File, key: string, isPublic: boolean): Promise<File>;
  upsertAvatar(userId: string, fileId: string): Promise<void>;
}

export class PrismaUploadUserAvatarRepository
  implements UploadUserAvatarRepository
{
  constructor(private readonly prisma: Prisma.TransactionClient) {}

  async getUser(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createFile(
    file: Core.File,
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

  async upsertAvatar(userId: string, fileId: string): Promise<void> {
    await this.prisma.avatar.upsert({
      where: { userId },
      update: { fileId },
      create: { userId, fileId },
    });
  }
}
