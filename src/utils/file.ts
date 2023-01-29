export function convertMulterFile(file: Express.Multer.File): Core.File {
  return {
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    buffer: file.buffer,
  };
}
