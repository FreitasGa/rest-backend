import type { Input, SuccessOutput } from '../../use-case';

export const input: Input = {
  template: 'confirm-email',
  options: {
    to: 'john@doe.com',
    data: {
      code: '123456',
      name: 'John Doe',
    },
  },
};

export const output: SuccessOutput = undefined;
