import config from 'config';
import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import path from 'path';

import {
  EmailService,
  Template,
  getSubject,
  SendEmailOptions,
} from './service';

export class NodemailerEmailService implements EmailService {
  private readonly transporter = nodemailer.createTransport({
    host: config.get('email.host'),
    port: config.get('email.port'),
    auth: {
      user: config.get('email.username'),
      pass: config.get('email.password'),
    },
  });

  private getTemplateFile(template: Template): string {
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

  async send<EmailTemplate extends Template>(
    template: EmailTemplate,
    options: SendEmailOptions<EmailTemplate>
  ): Promise<void> {
    if (!options.from) {
      options.from = config.get('email.from');
    }

    const templateFile = this.getTemplateFile(template);
    const compileTemplate = handlebars.compile(templateFile);

    const html = compileTemplate({
      ...options.data,
      appName: config.get('app.name'),
    });

    await this.transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: getSubject(template),
      html,
      cc: options.cc,
      bcc: options.bcc,
    });
  }
}
