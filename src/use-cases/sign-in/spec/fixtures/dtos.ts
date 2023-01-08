import type { Input, SuccessOutput } from '../../use-case';

export const input: Input = {
  email: 'john@doe.com',
  password: 'Passw0rd!',
};

export const output: SuccessOutput = {
  accessToken: {
    token: expect.any(String),
    expiresAt: expect.any(Number),
  },
  idToken: {
    token: expect.any(String),
    expiresAt: expect.any(Number),
  },
  refreshToken: {
    token: expect.any(String),
    expiresAt: expect.any(Number),
  },
};
