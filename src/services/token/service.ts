const TokenType = {
  AccessToken: 'AccessToken',
  IdToken: 'IdToken',
  RefreshToken: 'RefreshToken',
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];

export type AccessTokenPayload = {
  sub: string;
};

export type IdTokenPayload = {
  sub: string;
  email: string;
  name: string;
  confirmed: boolean;
};

export type RefreshTokenPayload = {
  sub: string;
};

export type Payload = {
  [TokenType.AccessToken]: AccessTokenPayload;
  [TokenType.IdToken]: IdTokenPayload;
  [TokenType.RefreshToken]: RefreshTokenPayload;
};

export type Token = {
  token: string;
  expiresAt: number;
};

export interface TokenService {
  sign<Type extends TokenType>(type: Type, payload: Payload[Type]): Token;
  verify<Type extends TokenType>(token: Token['token']): Payload[Type];
}
