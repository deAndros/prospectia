/**
 * Clase de Error personalizada para errores de API
 */
class ApiError extends Error {
    constructor(message, statusCode = 500, code = null) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.code = code;
    }
}

/**
 * Enviar respuesta 404 No Encontrado
 */
const send404 = (res, message = 'Resource not found') => {
    res.status(404).json({
        code: 404,
        message
    });
};

/**
 * Enviar respuesta de error genérica
 */
const sendError = (res, message = 'Internal server error', statusCode = 500) => {
    res.status(statusCode).json({
        code: statusCode,
        message
    });
};

/**
 * Formatear error para respuesta OpenAPI
 */
const formatError = (error) => {
    return {
        code: error.statusCode || error.code || 500,
        message: error.message || 'Internal server error'
    };
};

export default {
    ApiError,
    send404,
    sendError,
    formatError
};

export {
    ApiError,
    send404,
    sendError,
    formatError
};
