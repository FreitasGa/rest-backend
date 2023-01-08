import type { Input, SuccessOutput } from '../../use-case';

export const input: Input = {
  refreshToken:
    'eyJhbGciOiJIUzUxMiIsInR5cCI6InJ0K2p3dCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjcyOTMyMDE2LCJuYmYiOjE2NzI5MzI1MjMsImV4cCI6MTY3NTUyNDAxNiwiYXVkIjoicmVzdC5hcGkiLCJpc3MiOiJodHRwczovL3Jlc3QuZ2ciLCJqdGkiOiJhYjhjY2Q4Zi03ZTBmLTRmZTktYTZiYS0wZDZlMzllZjhkOTkifQ._sY0MFOmFqIIpmHl9PlSxBa00uIxbQsSJcqPEt-0VNUGXUSjIJOLZgWyfGcpAmzroszPBFY6hL-pABx6HFjpiQ',
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
