import schemas from './schemas/index.js';
import parameters from './parameters.js';

export default {
    schemas,
    parameters,
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    }
};
