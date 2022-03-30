export class AppError extends Error {
    /**
     * Throws an application error
     * @param message
     * @param status - HTTP status (default 500)
     */
    constructor(message, status = 500) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

export class ValidButNotFoundError extends AppError {
    constructor(message = 'The barcode is valid but not found in database') {
        super(message, 404);
    }
}

export class InvalidBarcodeError extends AppError {
    constructor(message = 'The barcode is invalid') {
        super(message, 500);
    }
}
