import { MockEmailService } from '@services/email/mock';
import { SendEmailUseCase, SuccessOutput } from '../use-case';
import { input, output } from './fixtures/dtos';

function buildUseCase(): SendEmailUseCase {
  const emailService = new MockEmailService();

  return new SendEmailUseCase(emailService);
}

describe('SendEmailUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should succeed', async () => {
    const useCase = buildUseCase();
    const result = await useCase.run(input);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual<SuccessOutput>(output);
  });
});
