import fs from 'fs'
import path from 'path'
import prettier from 'prettier';

let prettierOptions: prettier.Options;

(async () => {
  const useCaseName = (process.argv[2] || '').replace(/ /g, '');

  console.info(`Creating new UseCase: ${useCaseName}`);

  try {
    if (!useCaseName) {
      throw new Error('UseCase name is required.');
    }

    const loadedPrettierOptions = await prettier.resolveConfig(
      path.join(__dirname, '..', '.prettierrc')
    );

    if (!loadedPrettierOptions) {
      throw new Error('Could not load prettier options.');
    }

    prettierOptions = loadedPrettierOptions;

    const upperUseCaseName = caseFirst(useCaseName, true);
    const useCaseFolderName = toKebabCase(useCaseName);

    const useCaseClassName = `${upperUseCaseName}UseCase`;

    const inputDtoName = `${upperUseCaseName}InputDto`;
    const outputDtoName = `${upperUseCaseName}OutputDto`;

    const queryInterfaceName = `${upperUseCaseName}Query`;
    const prismaQueryName = `Prisma${upperUseCaseName}Query`;

    const mutationInterfaceName = `${upperUseCaseName}Mutation`;
    const prismaMutationName = `Prisma${upperUseCaseName}Mutation`;

    const useCasesFolder = path.join(__dirname, '..', 'src', 'use-cases');

    if (!fs.existsSync(useCasesFolder)) {
      throw new Error(`UseCases folder does not exist: ${useCasesFolder}`);
    }

    const useCaseFolder = createUseCaseFolder(useCasesFolder, useCaseFolderName);

    createUseCaseFile(
      useCaseFolder,
      inputDtoName,
      outputDtoName,
      useCaseClassName,
      queryInterfaceName,
      mutationInterfaceName,
    )
    createQueryFile(
      useCaseFolder,
      queryInterfaceName,
      prismaQueryName,
    )
    createMutationFile(
      useCaseFolder,
      mutationInterfaceName,
      prismaMutationName,
    )
    createFactoryFile(
      useCaseFolder,
      useCaseClassName,
      prismaQueryName,
      prismaMutationName,
    )
    createErrorsFile(
      useCaseFolder,
      useCaseClassName,
    )
    createDtosFile(
      useCaseFolder,
      inputDtoName,
      outputDtoName,
    )
    createControllerFile(
      useCaseFolder,
      useCaseClassName,
      useCaseFolderName,
      inputDtoName,
      outputDtoName,
    )
  } catch (error) {
    console.error(`Could not create new UseCase...`);
    console.error(error);
  }
})();

function prettify(input: string) {
  return prettier.format(input, prettierOptions);
}

function createUseCaseFolder(
  useCasesFolder: string,
  useCasesFolderName: string,
) {
  const useCaseFolder = path.join(useCasesFolder, useCasesFolderName);

  if (fs.existsSync(useCaseFolder)) {
    throw new Error(`UseCase folder already exists: ${useCaseFolder}`);
  }

  fs.mkdirSync(useCaseFolder, 0o0755);
  // fs.mkdirSync(path.join(useCaseFolder, '__spec__'), 0o0755);
  // fs.mkdirSync(path.join(useCaseFolder, '__spec__', 'fixtures'), 0o0755);

  return useCaseFolder;
}

function createUseCaseFile(
  useCaseFolder: string,
  inputDtoName: string,
  outputDtoName: string,
  useCaseClassName: string,
  queryInterfaceName: string,
  mutationInterfaceName: string,
) {
  fs.writeFileSync(
    path.join(useCaseFolder, 'use-case.ts'),
    prettify(
      `
      import { Either, right, wrong } from '@core/either';
      import { UseCase } from '@core/use-case';
      import type { ApplicationError } from '@errors/application-error';
      import type { BusinessError } from '@errors/business-error';
      import { InputValidationError } from '@errors/input-validation-error';
      import type { UnknownError } from '@errors/unknown-error';
      import type * as dtos from './dtos';
      import * as errors from './errors';
      import type { ${mutationInterfaceName} } from './mutation';
      import type { ${queryInterfaceName} } from './query';

      export type Input = dtos.${inputDtoName};
      export type FailureOutput = BusinessError | ApplicationError | UnknownError;
      export type SuccessOutput = dtos.${outputDtoName};

      export class ${useCaseClassName} extends UseCase<Input, FailureOutput, SuccessOutput> {
        constructor(
          private readonly mutation: ${mutationInterfaceName},
          private readonly query: ${queryInterfaceName}
        ) {
          super();
        }

        protected validate(input: Input): Either<InputValidationError, void> {
          return wrong(new InputValidationError());
        }

        protected async execute(input: Input): Promise<Either<FailureOutput, SuccessOutput>> {
          return input.foo ? right(undefined) : wrong(new errors.DummyError());
        }
      } 
      `,
    )
  )
}

function createControllerFile(
  useCaseFolder: string,
  useCaseClassName: string,
  useCaseFolderName: string,
  inputDtoName: string,
  outputDtoName: string,
) {
  fs.writeFileSync(
    path.join(useCaseFolder, 'controller.ts'),
    prettify(
      `
      import {
        Controller as OvernightController,
        Post as OvernightPost
      } from '@overnightjs/core';
      import type { Request, Response } from 'express';

      import { Controller } from '@core/controller';
      import { ApplicationError } from '@errors/application-error';
      import type * as dtos from './dtos';
      import type * as errors from './errors';
      import { build${useCaseClassName} } from './factory';
      import type { FailureOutput, SuccessOutput } from './use-case';
      
      type ErrorTypes = keyof typeof errors | 'InputValidationError' | 'UnknownError';

      @OvernightController('/${useCaseFolderName}')
      export class ${useCaseClassName}Controller extends Controller<
        FailureOutput,
        SuccessOutput,
      > {
        @OvernightPost()
        async handle(
          req: Request,
          res: Response
        ): Promise<SuccessOutput | FailureOutput | undefined> {
          const useCase = await build${useCaseClassName}();
          const result = await useCase.run(req.body as dtos.${inputDtoName});

          if (result.isWrong()) {
            const error = result.value;

            const errorMap = this.getErrorMap<ErrorTypes>({
              InputValidationError: this.badRequest,
              UnknownError: this.internalServerError,
              DummyError: this.internalServerError,
            });

            const treatment = errorMap[error.constructor.name as ErrorTypes];

            if (!treatment) {
              throw new ApplicationError('Error not treated in use case.');
            }

            return treatment.bind(this)(req, res, result);
          }

          return this.ok(req, res, result);
        }
      }
      `
    )
  )
}

function createDtosFile(
  useCaseFolder: string,
  inputDtoName: string,
  outputDtoName: string,
) {
  fs.writeFileSync(
    path.join(useCaseFolder, 'dtos.ts'),
    prettify(
      `
      export type ${inputDtoName} = {
        foo: boolean;
      };

      export type ${outputDtoName} = void;

      export type DummyDto = {
        id: string;
      };
      `,
    )
  )
}

function createErrorsFile(
  useCaseFolder: string,
  useCaseClassName: string
) {
  fs.writeFileSync(
    path.join(useCaseFolder, 'errors.ts'),
    prettify(
      `
      import { BusinessError } from '@errors/business-error';

      export class DummyError extends BusinessError {
        constructor() {
          super('Dummy error created as an example.');
        }
      }
      `,
    )
  )
}

function createQueryFile(
  useCaseFolder: string,
  queryInterfaceName: string,
  prismaQueryName: string,
) {
  fs.writeFileSync(
    path.join(useCaseFolder, 'query.ts'),
    prettify(
      `
      import type { PrismaClient } from '@prisma/client';

      export interface ${queryInterfaceName} {}

      export class ${prismaQueryName} implements ${queryInterfaceName} {
        constructor(private readonly prisma: PrismaClient) {}
      }
      `,
    )
  )
}

function createMutationFile(
  useCaseFolder: string,
  mutationInterfaceName: string,
  prismaMutationName: string,
) {
  fs.writeFileSync(
    path.join(useCaseFolder, 'mutation.ts'),
    prettify(
      `
      import type { PrismaClient } from '@prisma/client';

      export interface ${mutationInterfaceName} {}

      export class ${prismaMutationName} implements ${mutationInterfaceName} {
        constructor(private readonly prisma: PrismaClient) {}
      }
      `
    )
  )
}

function createFactoryFile(
  useCaseFolder: string,
  useCaseClassName: string,
  prismaQueryName: string,
  prismaMutationName: string,
) {
  fs.writeFileSync(
    path.join(useCaseFolder, 'factory.ts'),
    prettify(
      `
      import { PrismaClient } from '@prisma/client';

      import { ${prismaMutationName} } from './mutation';
      import { ${prismaQueryName} } from './query';
      import { ${useCaseClassName} } from './use-case';

      export async function build${useCaseClassName}(): Promise<${useCaseClassName}> {
        const prisma = new PrismaClient();
        const query = new ${prismaQueryName}(prisma);
        const mutation = new ${prismaMutationName}(prisma);

        return new ${useCaseClassName}(query, mutation);
      }
      `
    )
  )
}

function createUseCaseSpecFile(
  useCaseFolder: string,
  useCaseFolderName: string,
  useCaseName: string,
  useCaseClassName: string,
  queryInterfaceName: string,
  upperUseCaseName: string,
) {
  fs.writeFileSync(
    path.join(useCaseFolder, '__spec__', 'use-case.spec.ts'),
    prettify(
      `
      class ${upperUseCaseName}QueryMock implements ${queryInterfaceName} {
        getById = jest.fn(
          async (_id: string): Promise<dtos.DummyDto | null> => fixtures.dummy
        )
      }

      const queryMock = new ${upperUseCaseName}QueryMock();
      const transactionHandler = new TransactionHandlerMock();
      const useCaseInput = {
        foo: true,
      }

      async function buildUseCase() {
        const useCase = new ${useCaseClassName}(
          transactionHandler,
          queryMock
        );

        return useCase;
      }

      describe('running ${useCaseName} use case tests', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        describe('success cases', () => {
          it('should return success', async () => {
            const useCase = await buildUseCase();
            const result = await useCase.run(useCaseInput);

            expect(result.isRight()).toBeTruthy();
            expect(result.value).toBeUndefined();	
          });
        });

        describe('failure cases', () => {
          it('should return failure', async () => {
            queryMock.getById.mockResolvedValueOnce(null);

            const useCase = await buildUseCase();
            const result = await useCase.run(useCaseInput);

            expect(result.isWrong()).toBeTruthy();
            expect(result.value).toBeInstanceOf(errors.DummyError);
          });
        });
      });
      `
    )
  )
}

function createControllerSpecFile(
  useCaseFolder: string,
  useCaseFolderName: string,
  useCaseClassName: string,
) {
  fs.writeFileSync(
    path.join(useCaseFolder, '__spec__', 'controller.spec.ts'),
    prettify(
      `
      jest.mock('../use-case.ts');
      const UseCaseMock = jest.mocked(${useCaseClassName}.prototype.run);

      const requestUrl = '/${useCaseFolderName}';
      const requestBody = {
        foo: true,
      }

      describe('running ${useCaseFolderName} web controller tests', () => {
        beforeEach(() => {
          jest.resetAllMocks();
        });

        it('should return status 200 when use case succeeds', async () => {
          UseCaseMock.mockResolvedValueOnce(right(undefined));

          const response = await request(app).post(requestUrl).send(requestBody);

          expect(response.status).toBe(StatusCodes.OK);
        });

        it('should return status 400 when use case fails with InputValidationError', async () => {
          UseCaseMock.mockResolvedValueOnce(wrong(new InputValidationError()));

          const response = await request(app).post(requestUrl).send(requestBody);

          expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        });

        it('should return status 500 when use case fails with UnknownError', async () => {
          UseCaseMock.mockResolvedValueOnce(wrong(new UnknownError()));

          const response = await request(app).post(requestUrl).send(requestBody);

          expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        });
      });
      `
    )
  )
}

function createFixtureFiles(
  useCaseFolder: string,
) {
  fs.writeFileSync(
    path.join(useCaseFolder, '__spec__', 'fixtures', 'dummy.ts'),
    prettify(
      `
      import * as dtos from '../../dtos';

      export const dummy: dtos.DummyDto = {
        id: 'dummy-id',
      }
      `
    )
  )

  fs.writeFileSync(
    path.join(useCaseFolder, '__spec__', 'fixtures', 'index.ts'),
    prettify(
      `
      import * as dummy from './dummy';

      export default {
        ...dummy,
      }
      `
    )
  )
}

function createQuerySpecFile(
  useCaseName: string,
  useCaseFolder: string,
  useCaseFolderName: string,
  typeOrmQueryName: string,
) {
  path.join(useCaseFolder, '__spec__', 'query.spec.ts'),
    prettify(
      `
      import { ${typeOrmQueryName} } from '@src/useCases/${useCaseFolderName}/query';
      import * as helpers from '@test/prefab/helper';
      import { genUser } from '@test/prefab/user';
      import { clearAllTables } from '@test/util';
      import * as dtos from '../dto';
      
      const query = new ${typeOrmQueryName}();

      describe('running ${useCaseName} typeorm query tests', () => {
        beforeAll(async () => {
          await clearAllTables();
        });
        afterEach(async () => {
          await clearAllTables();
        });
        
        it('should run all queries without error', async () => {
          await expect(
            query.getById(1)
          ).resolves.not.toThrowError();
        });
      
        it('should correctly foo data to dto', async () => {
          
          const user = await helpers.saveEntity(genUser());
          
          const expectedResult: dtos.DummyDto = {
            id: user.id,
          };
      
          const queryResult = await query.getById(
            user.id
          );
      
          expect(queryResult).toStrictEqual(expectedResult);
        });
      });
      `
  )
}

function caseFirst(input: string, upper: boolean): string {
  if (!input) {
    return input;
  }

  return `${ upper? input[0].toUpperCase() : input[0].toLowerCase() }${ input.substring(1) }`;
}

function toKebabCase(input: string): string {
  const match = input.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
  );

  if (!match) {
    return input;
  }

  return match.map(x => x.toLowerCase()).join('-');
}