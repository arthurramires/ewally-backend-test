import express from 'express';
import asyncHandler from 'express-async-handler';
import { barCodeService } from '../../services';

export const barcodesRouter = express.Router();

barcodesRouter.get(
    '/:barcode',
    asyncHandler(async (req, res) => {
        const { barcode } = req.params;
        const barcodeValidated = await barCodeService.getBarcode(barcode);
        res.send(barcodeValidated);
    })
);
