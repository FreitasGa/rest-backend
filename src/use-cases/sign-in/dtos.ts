export type SignInInput = {
  email: string;
  password: string;
};

export type SignInOutput = {
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
