import { User } from '@entities/user';

export const createUser = new User({
  id: '1',
  name: 'John Doe',
  email: 'john@doe.com',
  password: 'Passw0rd!',
  confirmed: true,
  secret: 'secret',
  blockedTill: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
});

export const userExists = false;
