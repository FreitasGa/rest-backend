import {
  EmailService,
  Template,
  getSubject,
  SendEmailOptions,
} from './service';

export class MockEmailService implements EmailService {
  async send<EmailTemplate extends Template>(
    template: EmailTemplate,
    options: SendEmailOptions<EmailTemplate>
  ): Promise<void> {
    const subject = getSubject(template);

    console.info(
      'Sending email',
      JSON.stringify({ template, subject, options })
    );
  }
}
