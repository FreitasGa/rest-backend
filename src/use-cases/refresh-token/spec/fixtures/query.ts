import { hashSync } from 'bcryptjs';

import { User } from '@entities/user';

export const findUserById = new User({
  id: '1',
  name: 'John Doe',
  email: 'john@doe.com',
  password: hashSync('Passw0rd!', 16),
  confirmed: true,
  secret: 'secret',
  counter: 0,
  blockedTill: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
});
