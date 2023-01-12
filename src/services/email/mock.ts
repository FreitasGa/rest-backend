import type { EmailService, EmailTemplate, SendEmailOptions } from './service';

export class MockEmailService implements EmailService {
  async sendEmail<Template extends EmailTemplate>(
    options: SendEmailOptions<Template>
  ): Promise<void> {
    console.info('Sending email', JSON.stringify(options));
  }
}
