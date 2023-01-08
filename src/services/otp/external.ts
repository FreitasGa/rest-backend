import { hotp } from 'otplib';

import type { CheckCodeInput, GenerateCodeInput, OtpService } from './service';

export class HotpOtpService implements OtpService {
  generateCode(input: GenerateCodeInput): string {
    return hotp.generate(input.secret, input.counter);
  }

  checkCode(input: CheckCodeInput): boolean {
    return hotp.check(input.code, input.secret, input.counter);
  }
}
