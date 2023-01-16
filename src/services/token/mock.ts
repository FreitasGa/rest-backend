import type { Payload, Token, TokenService, Type } from './service';

export class MockTokenService implements TokenService {
  private readonly token = 'mock_token';

  sign<Type extends TokenType>(_type: Type, _payload: Payload[Type]): Token {
    return {
      token: this.token,
      expiresAt: Date.now(),
    };
  }

  verify<Type extends TokenType>(token: string): Payload[Type] {
    if (token !== this.token) {
      throw new Error('Invalid token');
    }

    return {
      sub: 'mock_user_id',
    } as Payload[Type];
  }
}
