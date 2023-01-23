import { Queue } from '..';
import type { Data, FileQueueService, Job } from './service';

export class MockFileQueueService implements FileQueueService {
  async add<FileJob extends Job, FileData extends Data[FileJob]>(
    job: FileJob,
    data: FileData
  ): Promise<void> {
    console.info(
      'Adding Job',
      JSON.stringify({ queue: Queue.File, job, data })
    );
  }
}
