import { send404, sendError } from '#helpers/error.js';

/**
 * Error middleware for invalid routes
 */
export const error = (req, res) => {
    sendError(res, 'Route not found', 404);
};

export default error;
