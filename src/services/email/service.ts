import type { Attachment } from 'nodemailer/lib/mailer';

export enum EmailTemplate {
  VerifyEmail = 'verify-email',
}

export type EmailTemplateData = {
  [EmailTemplate.VerifyEmail]: {
    name: string;
    code: string;
  };
};

export type SendEmailOptions = {
  to: string;
  subject: string;
  template: EmailTemplate;
  data: EmailTemplateData[EmailTemplate];
  from?: string;
  cc?: string;
  bcc?: string;
  attachments?: Attachment[];
};

export interface EmailService {
  sendEmail(options: SendEmailOptions): Promise<void>;
}
