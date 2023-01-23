import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export function SingleUploadMiddleware(
  fieldName: string
): (req: Request, res: Response, next: NextFunction) => void {
  return upload.single(fieldName);
}

export function ArrayUploadMiddleware(
  fieldName: string,
  maxCount?: number
): (req: Request, res: Response, next: NextFunction) => void {
  return upload.array(fieldName, maxCount);
}

export function FieldsUploadMiddleware(
  fields: { name: string; maxCount?: number }[]
): (req: Request, res: Response, next: NextFunction) => void {
  return upload.fields(fields);
}
