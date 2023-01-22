import { BusinessError } from '@errors/business-error';

export class UserNotFoundError extends BusinessError {
  constructor() {
    super('User not found.');
  }
}

export class InvalidCodeError extends BusinessError {
  constructor() {
    super('Invalid code.');
  }
}
