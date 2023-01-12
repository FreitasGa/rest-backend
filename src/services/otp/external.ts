import { hotp } from 'otplib';

import type { OtpService } from './service';

export class HotpOtpService implements OtpService {
  generate(secret: string, counter: number): string {
    return hotp.generate(secret, counter);
  }

  check(code: string, secret: string, counter: number): boolean {
    return hotp.check(code, secret, counter);
  }
}
