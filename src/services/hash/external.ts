import bcrypt from 'bcryptjs';

import type { HashService } from './service';

export class BcryptHashService implements HashService {
  async hash(password: string, salt = 16): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
