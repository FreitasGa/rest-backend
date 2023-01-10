export type GenerateCodeInput = {
  secret: string;
  counter: number;
};

export type CheckCodeInput = {
  code: string;
  secret: string;
  counter: number;
};

export interface OtpService {
  generateCode(secret: string, counter: number): string;
  checkCode(code: string, secret: string, counter: number): boolean;
}
