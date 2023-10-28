/**
 * Custom error class to represent API response errors.
 * This class extends the built-in Error class and adds a `status` property
 * which can be used to indicate HTTP response status codes.
 *
 * @example
 * throw new ResponseError('Not found', 404);
 */
export class ResponseError extends Error {
  status: number;
  /**
   * Creates a new ResponseError instance.
   *
   * @param {string} message - The error message.
   * @param {number} [status=500] - The HTTP status code. Defaults to 500 if not provided.
   */
  constructor(message: string | undefined, status: number) {
    super(message);
    this.name = "ResponseError";
    this.status = status || 500;

    // Capturing stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}
