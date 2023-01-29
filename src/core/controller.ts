import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Right, Wrong } from './either';

type FailureResponse<FailureOutput, SuccessOutput> = (
  req: Request,
  res: Response,
  result: FailureOutput | Wrong<FailureOutput, SuccessOutput>
) => FailureOutput;

type ErrorMap<FailureOutput, SuccessOutput, Error extends string> = Record<
  Error,
  FailureResponse<FailureOutput, SuccessOutput>
>;

export abstract class Controller<FailureOutput extends Error, SuccessOutput> {
  mapError<Error extends string>(
    error: ErrorMap<FailureOutput, SuccessOutput, Error>
  ): ErrorMap<FailureOutput, SuccessOutput, Error> {
    return error;
  }

  protected ok(
    req: Request,
    res: Response,
    result: Right<FailureOutput, SuccessOutput>
  ): SuccessOutput | undefined {
    return this.sendSuccess(req, res, StatusCodes.OK, result);
  }

  protected created(
    req: Request,
    res: Response,
    result: Right<FailureOutput, SuccessOutput>
  ): SuccessOutput | undefined {
    return this.sendSuccess(req, res, StatusCodes.CREATED, result);
  }

  protected noContent(
    req: Request,
    res: Response,
    result: Right<FailureOutput, SuccessOutput>
  ): SuccessOutput | undefined {
    return this.sendSuccess(req, res, StatusCodes.NO_CONTENT, result);
  }

  protected badRequest(
    req: Request,
    res: Response,
    result: FailureOutput | Wrong<FailureOutput, SuccessOutput>
  ): FailureOutput {
    return this.sendFailure(req, res, StatusCodes.BAD_REQUEST, result);
  }

  protected notFound(
    req: Request,
    res: Response,
    result: FailureOutput | Wrong<FailureOutput, SuccessOutput>
  ): FailureOutput {
    return this.sendFailure(req, res, StatusCodes.NOT_FOUND, result);
  }

  protected conflict(
    req: Request,
    res: Response,
    result: FailureOutput | Wrong<FailureOutput, SuccessOutput>
  ): FailureOutput {
    return this.sendFailure(req, res, StatusCodes.CONFLICT, result);
  }

  protected unprocessableEntity(
    req: Request,
    res: Response,
    result: FailureOutput | Wrong<FailureOutput, SuccessOutput>
  ): FailureOutput {
    return this.sendFailure(req, res, StatusCodes.UNPROCESSABLE_ENTITY, result);
  }

  protected tooManyRequests(
    req: Request,
    res: Response,
    result: FailureOutput | Wrong<FailureOutput, SuccessOutput>
  ): FailureOutput {
    return this.sendFailure(req, res, StatusCodes.TOO_MANY_REQUESTS, result);
  }

  protected internalServerError(
    req: Request,
    res: Response,
    result: FailureOutput | Wrong<FailureOutput, SuccessOutput>
  ): FailureOutput {
    return this.sendFailure(
      req,
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      result
    );
  }

  protected notImplemented(
    req: Request,
    res: Response,
    result: FailureOutput | Wrong<FailureOutput, SuccessOutput>
  ): FailureOutput {
    return this.sendFailure(req, res, StatusCodes.NOT_IMPLEMENTED, result);
  }

  protected serviceUnavailable(
    req: Request,
    res: Response,
    result: FailureOutput | Wrong<FailureOutput, SuccessOutput>
  ): FailureOutput {
    return this.sendFailure(req, res, StatusCodes.SERVICE_UNAVAILABLE, result);
  }

  private sendSuccess(
    req: Request,
    res: Response,
    status: StatusCodes,
    result: Right<FailureOutput, SuccessOutput>
  ): SuccessOutput | undefined {
    const response = result?.value;

    console.info(
      `[${req.method}] ${req.originalUrl} - [${status}] body: ${JSON.stringify(
        response
      )}`
    );

    res.status(status).send(response);

    return response;
  }

  private sendFailure(
    req: Request,
    res: Response,
    status: StatusCodes,
    result: FailureOutput | Wrong<FailureOutput, SuccessOutput>
  ): FailureOutput {
    const response = result instanceof Wrong ? result.value : result;
    const error = { name: response.name, message: response.message };

    console.error(response);
    console.error(
      `[${req.method}] ${req.originalUrl} - [${status}] error: ${JSON.stringify(
        error
      )}`
    );

    res.status(status).send({
      name: response.name,
      message:
        response.name === 'UnknownError'
          ? 'Internal server error, please try again later or contact support'
          : response.message,
    });

    return response;
  }

  abstract handle(
    req: Request,
    res: Response
  ): Promise<SuccessOutput | FailureOutput | undefined>;
}
