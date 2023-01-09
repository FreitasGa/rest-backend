import type { EmailService, SendEmailOptions } from './service';

export class MockEmailService implements EmailService {
  async sendEmail(options: SendEmailOptions): Promise<void> {
    console.info('Sending email', JSON.stringify(options));
  }
}
