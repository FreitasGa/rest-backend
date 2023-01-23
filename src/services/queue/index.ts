export const Queue = {
  Email: 'EmailTransactionQueue',
  File: 'FileTransactionQueue',
} as const;

export type Queue = (typeof Queue)[keyof typeof Queue];
