import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { FileQueueService } from '@services/queue/file/service';
import type { StorageService } from '@services/storage/service';
import type { UploadUserAvatarInput, UploadUserAvatarOutput } from './dtos';
import { UserNotFoundError } from './errors';
import type { UploadUserAvatarRepository } from './repository';

export type Input = UploadUserAvatarInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = UploadUserAvatarOutput;

export class UploadUserAvatarUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly repository: UploadUserAvatarRepository,
    private readonly storageService: StorageService,
    private readonly fileQueueService: FileQueueService
  ) {
    super();
  }

  protected validate(input: Input): Either<InputValidationError, void> {
    if (
      !input.userId ||
      !input.avatar ||
      typeof input.userId !== 'string' ||
      typeof input.avatar !== 'object'
    ) {
      return wrong(new InputValidationError());
    }

    return right(undefined);
  }

  protected async execute(
    input: Input
  ): Promise<Either<FailureOutput, SuccessOutput>> {
    const user = await this.repository.getUser(input.userId);

    if (!user) {
      return wrong(new UserNotFoundError());
    }

    const key = await this.storageService.put(
      'rest-public',
      'avatars',
      input.avatar
    );

    const file = await this.repository.createFile(input.avatar, key, true);

    await this.repository.upsertAvatar(user.id, file.id);

    await this.fileQueueService.add('GenerateImageSizes', {
      bucket: 'rest-public',
      key,
      sizes: [128, 256, 512],
    });

    return right(undefined);
  }
}
