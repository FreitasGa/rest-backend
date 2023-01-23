import { File } from '@entities/file';

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
