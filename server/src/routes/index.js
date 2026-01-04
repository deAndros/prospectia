import { Router } from 'express';
import { errorHandler } from './middleWares/index.js';
import { send404, sendError } from '#helpers/error.js';
import openapi from '#openapi/index.js';

/**
 * Configurar rutas base
 * OpenAPI maneja todas las rutas /api automáticamente
 */
const configure = (app) => {
    const router = Router();

    // Estas rutas son manejadas por el middleware de OpenAPI en app.js
    // pero definimos fallbacks aquí para rutas que no son de OpenAPI
    
    router.get('/', (_, res) => send404(res));
    router.get('*', (_, res) => sendError(res, 'Route not found', 404));

    app.use('/', router);
    app.use(errorHandler);
};

export default { configure };
