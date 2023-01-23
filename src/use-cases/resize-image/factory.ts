import { prisma } from '@modules/database';
import { SharpImageService } from '@services/image/external';
import { MinioStorageService } from '@services/storage/external';
import { PrismaResizeImageRepository } from './repository';
import { ResizeImageUseCase } from './use-case';

export function buildUseCase(): ResizeImageUseCase {
  const repository = new PrismaResizeImageRepository(prisma);
  const storageService = new MinioStorageService();
  const imageService = new SharpImageService();

  return new ResizeImageUseCase(repository, storageService, imageService);
}
