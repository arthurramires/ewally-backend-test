import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { rootRouter } from './routes';
import { AppError } from './utils';

export function createApp() {
    const app = express();
    app.use(cors());

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(bodyParser.json());

    app.use(rootRouter);

    const apiDocument = require('./openapi.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocument));

    app.use(appErrorHandler);

    return app;
}

function appErrorHandler(err, req, res, next) {
    if (err instanceof AppError) {
        res.status(err.status).send({ error: err.message });
    } else if (err.detail) {
        res.status(500).send({ error: err.detail });
    } else {
        next(err);
    }
}
