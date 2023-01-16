import type { SendEmailOptions, Template } from '@services/email/service';

export const Job = {
  ConfirmEmail: 'ConfirmEmail',
  ResetPassword: 'ResetPassword',
} as const;

export type Job = (typeof Job)[keyof typeof Job];

export type Data = {
  [Job.ConfirmEmail]: SendEmailOptions<'confirm-email'>;
  [Job.ResetPassword]: SendEmailOptions<'reset-password'>;
};

export type QueueData = {
  template: Template;
  options: Data[Job];
};

export function getTemplate(job: Job): Template {
  const templates: Record<Job, Template> = {
    ConfirmEmail: 'confirm-email',
    ResetPassword: 'reset-password',
  };

  return templates[job];
}

export interface EmailQueueService {
  add<EmailJob extends Job, EmailData extends Data[EmailJob]>(
    job: EmailJob,
    data: EmailData
  ): Promise<void>;
}
