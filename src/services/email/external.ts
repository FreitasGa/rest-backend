import config from 'config';
import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import path from 'path';

import type { EmailService, EmailTemplate, SendEmailOptions } from './service';

export class NodemailerEmailService implements EmailService {
  private readonly transporter = nodemailer.createTransport({
    host: config.get('email.host'),
    port: config.get('email.port'),
    auth: {
      user: config.get('email.username'),
      pass: config.get('email.password'),
    },
  });

  private getTemplateSource(template: EmailTemplate): string {
    const templatesFolder: string = config.get('email.templatesFolder');

    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      templatesFolder,
      `${template}.hbs`
    );

    return fs.readFileSync(templatePath, 'utf8');
  }

  async sendEmail({
    to,
    subject,
    template,
    data,
    from,
    cc,
    bcc,
    attachments,
  }: SendEmailOptions): Promise<void> {
    if (!from) {
      from = config.get('email.from');
    }

    const templateSource = this.getTemplateSource(template);
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate({
      ...data,
      appName: config.get('app.name'),
    });

    await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
      cc,
      bcc,
      attachments,
    });
  }
}
