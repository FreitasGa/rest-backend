import type { HashService } from './service';

export class MockHashService implements HashService {
  async hash(password: string, _salt?: number): Promise<string> {
    return password;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return password === hashedPassword;
  }
}
