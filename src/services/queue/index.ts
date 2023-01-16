export const Queue = {
  Email: 'EmailTransactionQueue',
} as const;

export type Queue = (typeof Queue)[keyof typeof Queue];
