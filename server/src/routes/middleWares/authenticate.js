import { verifyToken } from '#helpers/jsonWebToken.js';
import logger from '#helpers/logger.js';

/**
 * Authentication middleware using JWT
 * 
 * NOTE: This middleware is IMPLEMENTED but NOT USED by default.
 * To enable authentication:
 * 1. Remove "security: []" from endpoints in openapi/api/leads.js
 * 2. Apply this middleware to routes in app.js
 * 
 * Example usage (commented by default):
 * // import { authenticate } from '#routes/middleWares/index.js';
 * // app.use('/api/leads', authenticate);
 */
export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                code: 401,
                message: 'No authorization token provided'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const decoded = verifyToken(token);

        // Attach user info to request
        req.user = decoded;
        
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(401).json({
            code: 401,
            message: 'Invalid or expired token'
        });
    }
};

export default authenticate;
