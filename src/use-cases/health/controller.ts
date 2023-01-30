import { Controller as OvernightController, Get } from '@overnightjs/core';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@OvernightController('health')
export class HealthController {
  @Get()
  handle(_req: Request, res: Response): void {
    res.status(StatusCodes.OK).send({ status: 'on' });
  }
}
