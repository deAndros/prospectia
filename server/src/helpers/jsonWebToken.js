import jwt from 'jsonwebtoken';

const { JWT_SECRET = 'your-secret-key-change-in-production' } = process.env;

/**
 * Generar token JWT
 * @param {Object} payload - Datos para codificar en el token
 * @param {String} expiresIn - Tiempo de expiración del token (por defecto: 24h)
 * @returns {String} Token JWT
 */
export const generateToken = (payload, expiresIn = '24h') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verificar token JWT
 * @param {String} token - Token JWT a verificar
 * @returns {Object} Payload del token decodificado
 * @throws {Error} Si el token es inválido
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Decodificar token JWT sin verificación
 * @param {String} token - Token JWT a decodificar
 * @returns {Object|null} Payload del token decodificado o null
 */
export const decodeToken = (token) => {
    return jwt.decode(token);
};

export default {
    generateToken,
    verifyToken,
    decodeToken
};
