import { prisma } from '@modules/database';
import { MinioStorageService } from '@services/storage/external';
import { PrismaUploadUserAvatarRepository } from './repository';
import { UploadUserAvatarUseCase } from './use-case';

export function buildUseCase(): UploadUserAvatarUseCase {
  const repository = new PrismaUploadUserAvatarRepository(prisma);
  const storageService = new MinioStorageService();

  return new UploadUserAvatarUseCase(repository, storageService);
}
