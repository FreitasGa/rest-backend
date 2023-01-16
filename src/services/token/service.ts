const Type = {
  AccessToken: 'AccessToken',
  IdToken: 'IdToken',
  RefreshToken: 'RefreshToken',
} as const;

export type Type = (typeof Type)[keyof typeof Type];

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
  [Type.AccessToken]: AccessTokenPayload;
  [Type.IdToken]: IdTokenPayload;
  [Type.RefreshToken]: RefreshTokenPayload;
};

export type Token = {
  token: string;
  expiresAt: number;
};

export interface TokenService {
  sign<TokenType extends Type>(type: Type, payload: Payload[TokenType]): Token;
  verify<TokenType extends Type>(token: Token['token']): Payload[TokenType];
}
