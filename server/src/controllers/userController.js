import userService from '#services/userService.js';
import logger from '#helpers/logger.js';

/**
 * Controlador de Usuarios
 */
const userController = {
    /**
     * Registrar un nuevo usuario
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    register: async (req, res, next) => {
        try {
            logger.info('Iniciando registro de usuario');
            const userData = req.body;
            
            const newUser = await userService.createUser(userData);
            
            // Si el registro es exitoso, podríamos loguear al usuario automáticamente
            const { token, user } = await userService.loginUser(userData.email, userData.password);

            res.status(201).json({
                code: 201,
                message: 'Usuario registrado exitosamente',
                data: {
                    user: newUser,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Iniciar sesión
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            
            const { token, user } = await userService.loginUser(email, password);
            
            res.status(200).json({
                code: 200,
                message: 'Login exitoso',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Actualizar perfil de usuario
     * @param {Object} req - Request de Express (con req.user del middleware de autenticación)
     * @param {Object} res - Response de Express
     */
    updateProfile: async (req, res, next) => {
        try {
            const userId = req.user.id; // Usuario autenticado desde el JWT
            const updates = req.body;

            const updatedUser = await userService.updateUserProfile(userId, updates);

            res.status(200).json({
                code: 200,
                message: 'Perfil actualizado exitosamente',
                data: {
                    user: updatedUser
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

export default userController;
