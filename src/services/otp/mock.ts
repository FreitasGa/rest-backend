import type { CheckCodeInput, GenerateCodeInput, OtpService } from './service';

export class MockOtpService implements OtpService {
  private readonly code = '123456';

  generateCode(_input: GenerateCodeInput): string {
    return this.code;
  }

  checkCode(input: CheckCodeInput): boolean {
    return input.code === this.code;
  }
}
