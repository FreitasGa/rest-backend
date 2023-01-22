import { BusinessError } from '@errors/business-error';

export class UserNotFoundError extends BusinessError {
  constructor() {
    super('User not found.');
  }
}

export class UserNotConfirmedError extends BusinessError {
  constructor() {
    super('User not confirmed.');
  }
}
