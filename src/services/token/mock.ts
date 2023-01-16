import type { Payload, Token, TokenService, Type } from './service';

export class MockTokenService implements TokenService {
  private readonly token = 'mock_token';

  sign<TokenType extends Type>(
    _type: TokenType,
    _payload: Payload[TokenType]
  ): Token {
    return {
      token: this.token,
      expiresAt: Date.now(),
    };
  }

  verify<TokenType extends Type>(token: string): Payload[TokenType] {
    if (token !== this.token) {
      throw new Error('Invalid token');
    }

    return {
      sub: 'mock_user_id',
    } as Payload[TokenType];
  }
}
