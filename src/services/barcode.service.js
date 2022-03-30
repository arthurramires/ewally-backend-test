import { barCodeRepository } from '../repositories';
function getBarcode(barCode) {
    return barCodeRepository.getBarcode(barCode);
}

export const barCodeService = {
    getBarcode
};
