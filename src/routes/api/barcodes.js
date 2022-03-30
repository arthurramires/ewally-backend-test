import express from 'express';
import asyncHandler from 'express-async-handler';
import { barCodeService } from '../../services';
import { cleanDigitableLine } from '../../utils/format';

export const barcodesRouter = express.Router();

barcodesRouter.get(
    '/:barcode',
    asyncHandler(async (req, res) => {
        const { barcode } = req.params;

        const barcodeValidated = await barCodeService.getBarcode(
            cleanDigitableLine(barcode)
        );
        res.send(barcodeValidated);
    })
);
