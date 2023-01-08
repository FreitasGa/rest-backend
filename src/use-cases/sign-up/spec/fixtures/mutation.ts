import { hashSync } from 'bcryptjs';

import { User } from '@entities/user';

export const createUser = new User({
  id: '1',
  name: 'John Doe',
  email: 'john@doe.com',
  password: hashSync('password', 16),
  confirmed: true,
  secret: 'secret',
  counter: 0,
  blockedTill: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
});

export const incrementUserCounter = undefined;
