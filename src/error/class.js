// Custom error class used to wrap errors with nice messages
export class NiceError extends Error {
    // Create nice error from message and cause error object
    constructor(message, cause, ...params) {
        super(message, ...params)

        this.name = 'NiceError'
        this.cause = cause
    }
}
