import { Router } from 'express';
import { errorHandler } from './middleWares/index.js';
import { send404, sendError } from '#helpers/error.js';
import openapi from '#openapi/index.js';

/**
 * Configure base routes
 * OpenAPI handles all /api routes automatically
 */
const configure = (app) => {
    const router = Router();

    // These routes are handled by OpenAPI middleware in app.js
    // but we define fallbacks here for non-OpenAPI routes
    
    router.get('/', (_, res) => send404(res));
    router.get('*', (_, res) => sendError(res, 'Route not found', 404));

    app.use('/', router);
    app.use(errorHandler);
};

export default { configure };
