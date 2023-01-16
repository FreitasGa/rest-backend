import config from 'config';
import { add } from 'date-fns';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { v4 as uuid } from 'uuid';

import { InvalidTokenError, TokenExpiredError } from './errors';
import type { Payload, Token, TokenService, Type } from './service';

export class JwtTokenService implements TokenService {
  private readonly secret: string = config.get('auth.secret');
  private readonly options: Partial<jwt.SignOptions> = {
    algorithm: 'HS256',
    audience: 'rest.api',
    issuer: 'https://rest.gg',
  };

  sign<TokenType extends Type>(
    type: TokenType,
    payload: Payload[TokenType]
  ): Token {
    const expiresIn: Record<Type, string> = {
      AccessToken: config.get('auth.accessToken.expiresIn'),
      IdToken: config.get('auth.idToken.expiresIn'),
      RefreshToken: config.get('auth.refreshToken.expiresIn'),
    };

    const typ: Record<Type, string> = {
      AccessToken: 'at+jwt',
      IdToken: 'id+jwt',
      RefreshToken: 'rt+jwt',
    };

    const result = jwt.sign(payload, this.secret, {
      algorithm: this.options.algorithm,
      audience: this.options.audience,
      issuer: this.options.issuer,
      expiresIn: expiresIn[type],
      jwtid: uuid(),
      header: {
        alg: 'HS512',
        typ: typ[type],
      },
    });

    return {
      token: result,
      expiresAt: add(new Date(), { seconds: ms(expiresIn[type]) }).getTime(),
    };
  }

  verify<TokenType extends Type>(token: Token['token']): Payload[TokenType] {
    try {
      const result = jwt.verify(token, this.secret, {
        audience: this.options.audience,
        issuer: this.options.issuer,
      });

      return result as Payload[TokenType];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errors: Record<string, TokenExpiredError | InvalidTokenError> = {
        [jwt.TokenExpiredError.name]: new TokenExpiredError(),
        [jwt.JsonWebTokenError.name]: new InvalidTokenError(),
        [jwt.NotBeforeError.name]: new InvalidTokenError(),
      };

      throw errors[error.name] || error;
    }
  }
}
