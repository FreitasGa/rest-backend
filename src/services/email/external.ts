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

  private getTemplate(template: EmailTemplate): string {
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

  async sendEmail<Template extends EmailTemplate>(
    options: SendEmailOptions<Template>
  ): Promise<void> {
    if (!options.from) {
      options.from = config.get('email.from');
    }

    const template = this.getTemplate(options.template);
    const compileTemplate = handlebars.compile(template);

    const html = compileTemplate({
      ...options.data,
      appName: config.get('app.name'),
    });

    await this.transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html,
      cc: options.cc,
      bcc: options.bcc,
    });
  }
}
