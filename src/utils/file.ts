export type File = {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
};

export function convertMulterFile(file: Express.Multer.File): File {
  return {
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    buffer: file.buffer,
  };
}
