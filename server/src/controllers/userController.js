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
    }
};

export default userController;
