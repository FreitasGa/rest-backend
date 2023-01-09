import type { Input, SuccessOutput } from '../../use-case';

export const input: Input = {
  refreshToken: 'mock_token',
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
};
