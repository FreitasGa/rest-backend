import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function routeNotFound(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const status = StatusCodes.NOT_FOUND;
  const error = { name: 'RouteNotFound', message: `Route not found` };

  console.error(
    `[${req.method}] ${
      req.originalUrl
    } - status: ${status} - error: ${JSON.stringify(error)}`,
  );

  res.status(status).send({
    code: status,
    error,
  });

  next();
}

export function errorHandler(
  req: Request,
  res: Response,
  status = StatusCodes.INTERNAL_SERVER_ERROR,
  err: Error,
): void {
  const error = { name: err.name, message: err.message };

  console.error(
    `[${req.method}] ${req.originalUrl} - status: ${status} - error: ${error}`,
  );

  res.status(status).send({
    error,
  });
}
