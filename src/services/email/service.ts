const EmailTemplate = {
  VerifyEmail: 'verify-email',
  ResetPassword: 'reset-password',
} as const;

export type EmailTemplate = (typeof EmailTemplate)[keyof typeof EmailTemplate];

export type VerifyEmailData = {
  name: string;
  code: string;
};

export type ResetPasswordData = {
  name: string;
  code: string;
};

export type EmailTemplateData = {
  [EmailTemplate.VerifyEmail]: VerifyEmailData;
  [EmailTemplate.ResetPassword]: ResetPasswordData;
};

export type SendEmailOptions<Template extends EmailTemplate> = {
  to: string;
  subject: string;
  template: Template;
  data: EmailTemplateData[Template];
  from?: string;
  cc?: string;
  bcc?: string;
};

export interface EmailService {
  sendEmail<Template extends EmailTemplate>(
    options: SendEmailOptions<Template>
  ): Promise<void>;
}
