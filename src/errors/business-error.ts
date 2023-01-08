export class BusinessError extends Error {
  constructor(message = 'Business logic error.') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
