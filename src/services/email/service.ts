export const Template = {
  ConfirmEmail: 'confirm-email',
  ResetPassword: 'reset-password',
} as const;

export type Template = (typeof Template)[keyof typeof Template];

export type ConfirmEmailData = {
  name: string;
  code: string;
};

export type ResetPasswordData = {
  name: string;
  code: string;
};

export type TemplateData = {
  [Template.ConfirmEmail]: ConfirmEmailData;
  [Template.ResetPassword]: ResetPasswordData;
};

export type SendEmailOptions<EmailTemplate extends Template> = {
  to: string;
  data: TemplateData[EmailTemplate];
  from?: string;
  cc?: string;
  bcc?: string;
};

export function getSubject(template: Template): string {
  const subjects: Record<Template, string> = {
    'confirm-email': 'Confirm your email',
    'reset-password': 'Reset your password',
  };

  return subjects[template];
}

export interface EmailService {
  send<EmailTemplate extends Template>(
    template: EmailTemplate,
    options: SendEmailOptions<EmailTemplate>
  ): Promise<void>;
}
