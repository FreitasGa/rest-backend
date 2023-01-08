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
  generateCode(input: GenerateCodeInput): string;
  checkCode(input: CheckCodeInput): boolean;
}
