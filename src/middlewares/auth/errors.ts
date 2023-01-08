export class TokenNotProvidedError extends Error {
  constructor(message = 'Token was not provided.') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidTokenFormatError extends Error {
  constructor(message = 'Token has invalid format.') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
