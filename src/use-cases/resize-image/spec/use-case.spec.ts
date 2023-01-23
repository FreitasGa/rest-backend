import type { File } from '@entities/file';
import { MockImageService } from '@services/image/mock';
import { MockStorageService } from '@services/storage/mock';
import { createFile } from '@use-cases/upload-user-avatar/spec/fixtures/repository';
import type { File as InternalFile } from '@utils/file';
import type { ResizeImageRepository } from '../repository';
import { ResizeImageUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';

class MockResizeImageRepository implements ResizeImageRepository {
  createFile = jest.fn(
    async (
      _file: InternalFile,
      _key: string,
      _isPublic: boolean
    ): Promise<File> => createFile
  );
}

const repository = new MockResizeImageRepository();

function buildUseCase(): ResizeImageUseCase {
  const storageService = new MockStorageService();
  const imageService = new MockImageService();

  return new ResizeImageUseCase(repository, storageService, imageService);
}

describe('ResizeImageUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    repository.createFile.mockResolvedValueOnce(createFile);

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });
});
