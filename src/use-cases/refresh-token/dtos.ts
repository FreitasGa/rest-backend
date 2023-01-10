export type RefreshTokenInput = {
  refreshToken: string;
};

export type RefreshTokenOutput = {
  accessToken: {
    token: string;
    expiresAt: number;
  };
  idToken: {
    token: string;
    expiresAt: number;
  };
  refreshToken: {
    token: string;
    expiresAt: number;
  };
};
