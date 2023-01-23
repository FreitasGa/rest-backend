import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { InvalidTokenError } from '@services/token/errors';
import { JwtTokenService } from '@services/token/external';
import type { AccessTokenPayload, TokenService } from '@services/token/service';
import { errorHandler } from '@utils/http';
import { InvalidTokenFormatError, TokenNotProvidedError } from './errors';

async function tokenValidate(
  token: string,
  service: TokenService
): Promise<AccessTokenPayload> {
  const tokenSections = token.split('.');

  if (tokenSections.length !== 3) {
    throw new InvalidTokenError();
  }

  return service.verify(token);
}

export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      throw new TokenNotProvidedError();
    }

    if (!authorization.startsWith('Bearer ')) {
      throw new InvalidTokenFormatError();
    }

    const [, token] = authorization.split(' ');
    const result = await tokenValidate(token, new JwtTokenService());

    req.userId = result.sub;

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorHandler(req, res, StatusCodes.UNAUTHORIZED, error);
  }
}
