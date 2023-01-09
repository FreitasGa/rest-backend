import { User } from '@entities/user';

export const getUserById = new User({
  id: '1',
  name: 'John Doe',
  email: 'john@doe.com',
  password: 'Passw0rd!',
  confirmed: true,
  secret: 'secret',
  counter: 0,
  blockedTill: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
});
