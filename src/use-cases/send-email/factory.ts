import { NodemailerEmailService } from '@services/email/external';
import { SendEmailUseCase } from './use-case';

export async function buildUseCase(): Promise<SendEmailUseCase> {
  const emailService = new NodemailerEmailService();

  return new SendEmailUseCase(emailService);
}
