export class File {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  key: string;
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(input: File) {
    this.id = input.id;
    this.originalName = input.originalName;
    this.size = input.size;
    this.mimeType = input.mimeType;
    this.key = input.key;
    this.public = input.public;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.deletedAt = input.deletedAt;
  }
}
