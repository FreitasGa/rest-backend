import {
  EmailService,
  EmailTemplate,
  getSubject,
  SendEmailOptions,
} from './service';

export class MockEmailService implements EmailService {
  async send<Template extends EmailTemplate>(
    template: Template,
    options: SendEmailOptions<Template>
  ): Promise<void> {
    const subject = getSubject(template);

    console.info(
      'Sending email',
      JSON.stringify({ template, subject, options })
    );
  }
}
