declare namespace Core {
  export type File = {
    originalName: string;
    mimeType: string;
    size: number;
    buffer: Buffer;
  };
}
