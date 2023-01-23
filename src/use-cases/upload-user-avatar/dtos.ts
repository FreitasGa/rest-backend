import type { File } from '@utils/file';

export type UploadUserAvatarInput = {
  userId: string;
  avatar: File;
};

export type UploadUserAvatarOutput = void;
