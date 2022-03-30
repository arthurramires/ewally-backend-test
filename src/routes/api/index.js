import express from 'express';
import { barcodesRouter } from './barcodes';

export const apiRouter = express.Router();
apiRouter.use('/', barcodesRouter);
