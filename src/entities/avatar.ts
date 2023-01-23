export class Avatar {
  id: string;
  userId: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(input: Avatar) {
    this.id = input.id;
    this.userId = input.userId;
    this.fileId = input.fileId;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.deletedAt = input.deletedAt;
  }
}
