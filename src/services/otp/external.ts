import config from 'config';
import ms from 'ms';
import { totp } from 'otplib';

import type { OtpService } from './service';

export class HotpOtpService implements OtpService {
  constructor() {
    const digits: number = config.get('otp.digits');
    const expiresIn: string = config.get('otp.expiresIn');

    totp.options = {
      digits,
      step: ms(expiresIn),
    };
  }

  generate(secret: string): string {
    return totp.generate(secret);
  }

  check(code: string, secret: string): boolean {
    return totp.check(code, secret);
  }
}
