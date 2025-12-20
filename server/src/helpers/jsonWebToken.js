import jwt from 'jsonwebtoken';

const { JWT_SECRET = 'your-secret-key-change-in-production' } = process.env;

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @param {String} expiresIn - Token expiration time (default: 24h)
 * @returns {String} JWT token
 */
export const generateToken = (payload, expiresIn = '24h') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Decode JWT token without verification
 * @param {String} token - JWT token to decode
 * @returns {Object|null} Decoded token payload or null
 */
export const decodeToken = (token) => {
    return jwt.decode(token);
};

export default {
    generateToken,
    verifyToken,
    decodeToken
};
