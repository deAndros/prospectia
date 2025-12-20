import logger from '#helpers/logger.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
    logger.error('Error handler:', err);

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;
