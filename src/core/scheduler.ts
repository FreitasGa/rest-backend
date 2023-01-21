import { Right, Wrong } from './either';

export abstract class Scheduler<FailureOutput extends Error, SuccessOutput> {
  protected success(
    result: Right<FailureOutput, SuccessOutput>
  ): SuccessOutput {
    const response = result?.value;

    console.info(`[Success] data: ${JSON.stringify(response)}`);

    return response;
  }

  protected failure(
    result: FailureOutput | Wrong<FailureOutput, SuccessOutput>
  ): FailureOutput {
    const response = result instanceof Wrong ? result.value : result;
    const error = { name: response.name, message: response.message };

    console.error(response);
    console.error(`[Failure] error: ${JSON.stringify(error)}`);

    return response;
  }

  abstract handle(): Promise<SuccessOutput | FailureOutput | undefined>;
}
