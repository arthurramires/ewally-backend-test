const {
    NotFoundError,
    InvalidBarcodeError
} = require('../utils/custom-errors');
describe('Creating custom error messages', () => {
    it('should throw error Not Found', () => {
        const testingErrors = () => {
            throw new NotFoundError();
        };
        expect(testingErrors).toThrow(NotFoundError);
        expect(new NotFoundError().message).toEqual(
            'Information from barcode not found!'
        );
    });

    it('should throw error Invalid Barcode', () => {
        const testingErrors = () => {
            throw new InvalidBarcodeError();
        };
        expect(testingErrors).toThrow(InvalidBarcodeError);
        expect(new InvalidBarcodeError().message).toEqual(
            'The barcode is invalid!'
        );
    });
});
