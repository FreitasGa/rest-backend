import { BusinessError } from '@errors/business-error';

export class InvalidCredentialsError extends BusinessError {
  constructor() {
    super('Invalid credentials.');
  }
}
