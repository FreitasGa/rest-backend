export class ApplicationError extends Error {
  constructor(message = 'Error not handled by the application.') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
