export class AppError extends Error {
    /**
     * Throws an application error
     * @param message
     * @param status - HTTP status (default 500)
     */
    constructor(message, status = 500) {
        super();
        this.status = status;
        this.name = this.constructor.name;
        this.message = message;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Information from barcode not found!') {
        super(message, 404);
    }
}

export class InvalidBarcodeError extends AppError {
    constructor(message = 'The barcode is invalid!') {
        super(message, 500);
    }
}
