import type { Job } from 'bullmq';
import { Right, Wrong } from './either';

export abstract class Worker<FailureOutput extends Error, SuccessOutput> {
  protected success(
    job: Job,
    result: Right<FailureOutput, SuccessOutput>
  ): SuccessOutput {
    const response = result?.value;

    console.info(
      `[${job.queueName}] ${job.name} - [Success] data: ${JSON.stringify(
        response
      )}`
    );

    return response;
  }

  protected failure(
    job: Job,
    result: FailureOutput | Wrong<FailureOutput, SuccessOutput>
  ): FailureOutput {
    const response = result instanceof Wrong ? result.value : result;
    const error = { name: response.name, message: response.message };

    console.error(response);
    console.error(
      `[${job.queueName}] ${job.name} - [Failure] error: ${JSON.stringify(
        error
      )}`
    );

    return response;
  }

  abstract handle(job: Job): Promise<SuccessOutput | FailureOutput | undefined>;
}
