/**
 * Custom response error
 */
export class ResponseError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ResponseError';
        this.status = status || 500;
        // Capturing stack trace, excluding constructor call from it
        // (this is probably no longer required in node >=8, see the comments)
        Error.captureStackTrace(this, this.constructor);
    }
}
