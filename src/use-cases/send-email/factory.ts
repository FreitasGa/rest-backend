import { NodemailerEmailService } from '@services/email/external';
import { SendEmailUseCase } from './use-case';

export function buildUseCase(): SendEmailUseCase {
  const emailService = new NodemailerEmailService();

  return new SendEmailUseCase(emailService);
}
