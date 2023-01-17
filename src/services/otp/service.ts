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
  generate(secret: string): string;
  check(code: string, secret: string): boolean;
}
