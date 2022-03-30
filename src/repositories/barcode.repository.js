import {
    InvalidBarcodeError,
    NotFoundError,
    valTitBancario,
    valTitArrecadacao
} from '../utils';

function getBarcode(searchBarCode) {
    const barcode =
        valTitBancario(searchBarCode) || valTitArrecadacao(searchBarCode);

    const barcodeIsValid = barcode !== false ? true : barcode;

    if (!barcodeIsValid) {
        return new InvalidBarcodeError();
    }

    if (barcode === null) {
        return new NotFoundError();
    }

    return barcode;
}

export const barCodeRepository = {
    getBarcode
};
