import { File } from '@entities/file';
import { User } from '@entities/user';

export const getUser = new User({
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

export const createFile = new File({
  id: '1',
  key: 'key',
  originalName: 'originalName',
  mimeType: 'image/png',
  size: 123,
  public: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
});

export const upsertAvatar = undefined;
