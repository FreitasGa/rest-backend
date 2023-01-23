import type { Input, SuccessOutput } from '../../use-case';

export const input: Input = {
  userId: '1',
  avatar: {
    originalName: 'originalName',
    mimeType: 'image/png',
    size: 123,
    buffer: Buffer.from('buffer'),
  },
};

export const output: SuccessOutput = undefined;
