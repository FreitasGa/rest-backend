export class InputValidationError extends Error {
  constructor(message = 'One or more input values are invalid.') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
