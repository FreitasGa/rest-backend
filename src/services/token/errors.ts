export class TokenExpiredError extends Error {
  constructor(message = 'Token has expired.') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidTokenError extends Error {
  constructor(message = 'Token is invalid.') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
