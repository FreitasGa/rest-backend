import type { OtpService } from './service';

export class MockOtpService implements OtpService {
  private readonly code = '123456';

  generateCode(_secret: string, _counter: number): string {
    return this.code;
  }

  checkCode(code: string, _secret: string, _counter: number): boolean {
    return code === this.code;
  }
}
