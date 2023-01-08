export type SignInInputDto = {
  email: string;
  password: string;
};

export type SignInOutputDto = {
  accessToken: {
    token: string;
    expiresAt: number;
  };
  refreshToken: {
    token: string;
    expiresAt: number;
  };
  idToken: {
    token: string;
    expiresAt: number;
  };
};
