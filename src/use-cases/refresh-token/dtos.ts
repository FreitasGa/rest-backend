export type RefreshTokenInputDto = {
  refreshToken: string;
};

export type RefreshTokenOutputDto = {
  accessToken: {
    token: string;
    expiresAt: number;
  };
  idToken: {
    token: string;
    expiresAt: number;
  };
};
