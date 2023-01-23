import { Either, right, wrong } from '@core/either';
import { UseCase } from '@core/use-case';
import type { ApplicationError } from '@errors/application-error';
import type { BusinessError } from '@errors/business-error';
import { InputValidationError } from '@errors/input-validation-error';
import type { UnknownError } from '@errors/unknown-error';
import type { ImageService } from '@services/image/service';
import type { StorageService } from '@services/storage/service';
import type { ResizeImageInput, ResizeImageOutput } from './dtos';
import type { ResizeImageRepository } from './repository';

export type Input = ResizeImageInput;
export type FailureOutput = BusinessError | ApplicationError | UnknownError;
export type SuccessOutput = ResizeImageOutput;

export class ResizeImageUseCase extends UseCase<
  Input,
  FailureOutput,
  SuccessOutput
> {
  constructor(
    private readonly repository: ResizeImageRepository,
    private readonly storageService: StorageService,
    private readonly imageService: ImageService
  ) {
    super();
  }

  protected validate(input: Input): Either<InputValidationError, void> {
    if (
      !input.bucket ||
      !input.key ||
      !input.sizes ||
      typeof input.bucket !== 'string' ||
      typeof input.key !== 'string' ||
      !Array.isArray(input.sizes)
    ) {
      return wrong(new InputValidationError());
    }

    return right(undefined);
  }

  protected async execute(
    input: Input
  ): Promise<Either<FailureOutput, SuccessOutput>> {
    const file = await this.storageService.get(input.bucket, input.key);

    await Promise.all(
      input.sizes.map(async (size) => {
        const resizedFile = await this.imageService.resize(file, {
          width: size,
          height: size,
          format: 'webp',
          quality: 80,
        });

        const [name] = input.key.split('.');
        const key = `${name}-${size}.webp`;

        await this.storageService.put(input.bucket, 'avatars', resizedFile, {
          key,
        });

        await this.repository.createFile(resizedFile, key, true);
      })
    );

    return right(undefined);
  }
}
