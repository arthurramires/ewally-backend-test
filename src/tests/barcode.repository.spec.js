const { barCodeRepository } = require('../repositories/barcode.repository');
const {
    NotFoundError,
    InvalidBarcodeError
} = require('../utils/custom-errors');
const exampleBarcodeArrecadacao =
    '846700000009999900820898992871486310456921311993';
const exampleBarcodeArrecadacaoInvalid =
    '846700000009999900820898992871486310456921311900';
const exampleBarcodeBank = '00190000090340609800815223411172788970000014900';

describe('Validating digitable lines from barcodes', () => {
    it('should return info from barcode from bank', () => {
        const expectedObject = {
            amount: '149.00',
            expirationDate: '2022-02-15',
            line: '00190000090340609800815223411172788970000014900',
            barCode: '00197889700000149000000003406098001522341117'
        };

        const barcode = barCodeRepository.getBarcode(exampleBarcodeBank);
        expect(barcode).toEqual(expectedObject);
    });

    it('should return info from barcode from collection', () => {
        const expectedObject = {
            amount: 99.99,
            expirationDate: null,
            line: '846700000009999900820898992871486310456921311993',
            barCode: '84670000000999900820899928714863145692131199'
        };

        const barcode = barCodeRepository.getBarcode(exampleBarcodeArrecadacao);
        expect(barcode).toEqual(expectedObject);
    });
});
