import type { Template, SendEmailOptions } from '@services/email/service';

export type SendEmailInput = {
  template: Template;
  options: SendEmailOptions<Template>;
};

export type SendEmailOutput = void;
