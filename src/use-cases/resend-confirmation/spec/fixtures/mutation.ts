import { User } from '@entities/user';

export const incrementUserCounterById = new User({
  id: '1',
  name: 'John Doe',
  email: 'john@doe.com',
  password: 'Passw0rd!',
  confirmed: true,
  secret: 'secret',
  counter: 1,
  blockedTill: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
});
