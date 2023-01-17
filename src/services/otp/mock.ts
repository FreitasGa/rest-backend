import type { OtpService } from './service';

export class MockOtpService implements OtpService {
  private readonly code = '123456';

  generate(_secret: string): string {
    return this.code;
  }

  check(code: string, _secret: string): boolean {
    return code === this.code;
  }
}
