const EmailTemplate = {
  ConfirmEmail: 'confirm-email',
  ResetPassword: 'reset-password',
} as const;

export type EmailTemplate = (typeof EmailTemplate)[keyof typeof EmailTemplate];

export type ConfirmEmailData = {
  name: string;
  code: string;
};

export type ResetPasswordData = {
  name: string;
  code: string;
};

export type EmailTemplateData = {
  [EmailTemplate.ConfirmEmail]: ConfirmEmailData;
  [EmailTemplate.ResetPassword]: ResetPasswordData;
};

export type SendEmailOptions<Template extends EmailTemplate> = {
  to: string;
  data: EmailTemplateData[Template];
  from?: string;
  cc?: string;
  bcc?: string;
};

export function getSubject(template: EmailTemplate): string {
  const subjects: Record<EmailTemplate, string> = {
    'confirm-email': 'Confirm your email',
    'reset-password': 'Reset your password',
  };

  return subjects[template];
}

export interface EmailService {
  send<Template extends EmailTemplate>(
    template: Template,
    options: SendEmailOptions<Template>
  ): Promise<void>;
}
