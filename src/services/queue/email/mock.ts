import { Data, EmailQueueService, getTemplate, Job } from './service';

export class MockEmailQueueService implements EmailQueueService {
  async add<EmailJob extends Job, EmailData extends Data[EmailJob]>(
    job: EmailJob,
    data: EmailData
  ): Promise<void> {
    const template = getTemplate(job);

    console.log(
      'Adding Job to EmailTransactionQueue',
      JSON.stringify({ job, template, data })
    );
  }
}
