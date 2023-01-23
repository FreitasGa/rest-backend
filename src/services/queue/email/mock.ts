import { Queue } from '..';
import { Data, EmailQueueService, getTemplate, Job } from './service';

export class MockEmailQueueService implements EmailQueueService {
  async add<EmailJob extends Job, EmailData extends Data[EmailJob]>(
    job: EmailJob,
    data: EmailData
  ): Promise<void> {
    const template = getTemplate(job);

    console.info(
      'Adding Job',
      JSON.stringify({ queue: Queue.Email, job, template, data })
    );
  }
}
