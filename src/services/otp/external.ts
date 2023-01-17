import config from 'config';
import ms from 'ms';
import { totp } from 'otplib';

import type { OtpService } from './service';

export class HotpOtpService implements OtpService {
  constructor() {
    totp.options = {
      step: ms(config.get('otp.step') as string),
      window: parseInt(config.get('otp.window'), 10),
      digits: parseInt(config.get('otp.digits'), 10),
    };
  }

  generate(secret: string): string {
    return totp.generate(secret);
  }

  check(code: string, secret: string): boolean {
    return totp.check(code, secret);
  }
}
