import type { File } from '@entities/file';
import type { User } from '@entities/user';
import { MockStorageService } from '@services/storage/mock';
import type { File as InternalFile } from '@utils/file';
import { UserNotFoundError } from '../errors';
import type { UploadUserAvatarRepository } from '../repository';
import { SuccessOutput, UploadUserAvatarUseCase } from '../use-case';
import { input, output } from './fixtures/dtos';
import { createFile, getUser, upsertAvatar } from './fixtures/repository';

class MockUploadUserAvatarRepository implements UploadUserAvatarRepository {
  getUser = jest.fn(async (_id: string): Promise<User | null> => getUser);
  createFile = jest.fn(
    async (
      _file: InternalFile,
      _key: string,
      _isPublic: boolean
    ): Promise<File> => createFile
  );
  upsertAvatar = jest.fn(
    async (_userId: string, _fileId: string): Promise<void> => upsertAvatar
  );
}

const repository = new MockUploadUserAvatarRepository();

function buildUseCase(): UploadUserAvatarUseCase {
  const storageService = new MockStorageService();

  return new UploadUserAvatarUseCase(repository, storageService);
}

describe('UploadUserAvatarUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    repository.getUser.mockResolvedValueOnce(getUser);
    repository.createFile.mockResolvedValueOnce(createFile);
    repository.upsertAvatar.mockResolvedValueOnce(upsertAvatar);

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });

  it('should fail with UserNotFoundError', async () => {
    repository.getUser.mockResolvedValueOnce(null);
    repository.createFile.mockResolvedValueOnce(createFile);
    repository.upsertAvatar.mockResolvedValueOnce(upsertAvatar);

    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isWrong()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
