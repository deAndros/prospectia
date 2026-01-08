import User from '#models/userModel.js';
import { OAuth2Client } from 'google-auth-library';
import { hashPassword, comparePassword } from '#helpers/bcrypt.js';
import { generateToken } from '#helpers/jsonWebToken.js';
import logger from '#helpers/logger.js';
import { ApiError } from '#helpers/error.js';

/**
 * Servicio para gestionar usuarios
 */
const userService = {
    /**
     * Crear un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Object} Usuario creado (sin password)
     */
    createUser: async (userData) => {
        try {
            const { firstName, lastName, email, password } = userData;

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                // No lanzamos error específico de "email existe" por seguridad en el controller,
                // pero aquí en servicio debemos saberlo. 
                // El controller decidirá cómo manejar el mensaje al cliente si se requiere.
                throw new ApiError('El correo electrónico ya está registrado', 409);
            }

            // Hashear contraseña si se provee
            let passwordHash = undefined;
            if (password) {
                passwordHash = await hashPassword(password);
            }

            const newUser = new User({
                firstName,
                lastName,
                email,
                passwordHash,
                authProviders: ['LOCAL'],
                emailVerified: false // Inicialmente falso
            });

            await newUser.save();
            logger.info(`Usuario creado: ${email}`);

            return newUser;
        } catch (error) {
            logger.error('Error en userService.createUser:', error);
            throw error;
        }
    },

    /**
     * Autenticar usuario y generar token
     * @param {String} email 
     * @param {String} password 
     * @returns {Object} Token y datos de usuario
     */
    loginUser: async (email, password) => {
        try {
            const user = await User.findOne({ email });
            
            // Verificaciones de seguridad
            if (!user) {
                logger.warn(`Intento de login fallido - Usuario no encontrado: ${email}`);
                throw new ApiError('Credenciales inválidas', 401);
            }

            // Verificar que sea cuenta local y tenga password
            if (!user.authProviders.includes('LOCAL') || !user.passwordHash) {
                logger.warn(`Intento de login fallido - Proveedor incorrecto: ${email}`);
                throw new ApiError('Credenciales inválidas', 401);
            }

            // Verificar contraseña
            const isMatch = await comparePassword(password, user.passwordHash);
            if (!isMatch) {
                // Incrementar intentos fallidos (TODO: implementar lógica de bloqueo)
                user.failedLoginAttempts += 1;
                await user.save();
                logger.warn(`Intento de login fallido - Password incorrecto: ${email}`);
                throw new ApiError('Credenciales inválidas', 401);
            }

            // Resetear intentos fallidos si login exitoso
            if (user.failedLoginAttempts > 0) {
                user.failedLoginAttempts = 0;
            }
            user.lastLoginAt = new Date();
            await user.save();

            // Generar token
            const token = generateToken({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            });

            return {
                token,
                user
            };
        } catch (error) {
            logger.error('Error en userService.loginUser:', error);
            throw error;
        }
    },

    /**
     * Actualizar perfil de usuario
     * @param {String} userId - ID del usuario
     * @param {Object} updates - Campos a actualizar
     * @returns {Object} Usuario actualizado
     */
    updateUserProfile: async (userId, updates) => {
        try {
            const { email, firstName, lastName, profileImage } = updates;

            // Si se está actualizando el email, verificar que no exista para otro usuario
            if (email) {
                const existingUser = await User.findOne({ 
                    email, 
                    _id: { $ne: userId } // Excluir al usuario actual
                });
                if (existingUser) {
                    throw new ApiError('El correo electrónico ya está registrado por otro usuario', 409);
                }
            }

            // Validar tamaño de imagen si se provee (base64)
            if (profileImage && profileImage.startsWith('data:image')) {
                const sizeInBytes = (profileImage.length * 3) / 4;
                const maxSize = 2 * 1024 * 1024; // 2MB
                if (sizeInBytes > maxSize) {
                    throw new ApiError('La imagen es demasiado grande. Máximo 2MB', 400);
                }
            }

            // Construir objeto de actualización solo con campos definidos
            const updateData = {};
            if (firstName !== undefined) updateData.firstName = firstName;
            if (lastName !== undefined) updateData.lastName = lastName;
            if (email !== undefined) updateData.email = email;
            if (profileImage !== undefined) updateData.profileImage = profileImage;

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                throw new ApiError('Usuario no encontrado', 404);
            }

            logger.info(`Perfil actualizado para usuario: ${updatedUser.email}`);
            return updatedUser;
        } catch (error) {
            logger.error('Error en userService.updateUserProfile:', error);
            throw error;
        }
    },

    /**
     * Buscar usuario por ID
     * @param {String} id 
     * @returns {Object} Usuario
     */
    getUserById: async (id) => {
        return await User.findById(id);
    },

    /**
     * Autenticación con Google (Login/Register) - Flujo Tradicional (Código)
     * @param {String} code - Código de autorización enviado por el cliente
     * @returns {Object} Token JWT de la app y datos del usuario
     */
    googleAuth: async (code) => {
        try {
            // El REDIRECT_URI debe coincidir exactamente con el del frontend
            const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback';
            
            const client = new OAuth2Client(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                redirectUri
            );
            
            // Intercambiar el código por tokens
            const { tokens } = await client.getToken(code);
            client.setCredentials(tokens);

            // Verificar el idToken incluido en la respuesta de tokens
            const ticket = await client.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            
            const payload = ticket.getPayload();
            const { sub: googleId, email, given_name: firstName, family_name: lastName, picture: profileImage } = payload;

            // 1. Buscar si ya existe por googleId
            let user = await User.findOne({ googleId });

            // 2. Si no existe por googleId, buscar por email
            if (!user) {
                user = await User.findOne({ email });
                
                if (user) {
                    // Si existe por email, vincular la cuenta de Google
                    user.googleId = googleId;
                    if (!user.authProviders.includes('GOOGLE')) {
                        user.authProviders.push('GOOGLE');
                    }
                    // Si no tiene imagen, usar la de Google
                    if (!user.profileImage) {
                        user.profileImage = profileImage;
                    }
                    await user.save();
                    logger.info(`Cuenta de Google vinculada al usuario existente: ${email}`);
                } else {
                    // 3. Si no existe, crear un nuevo usuario
                    user = new User({
                        firstName: firstName || 'Usuario',
                        lastName: lastName || 'Google',
                        email,
                        googleId,
                        authProviders: ['GOOGLE'],
                        emailVerified: true, // Google ya verificó el email
                        profileImage: profileImage || null
                    });
                    await user.save();
                    logger.info(`Nuevo usuario creado mediante Google: ${email}`);
                }
            }

            // Actualizar último login
            user.lastLoginAt = new Date();
            await user.save();

            // Generar token JWT de nuestra aplicación
            const token = generateToken({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            });

            return {
                token,
                user
            };
        } catch (error) {
            logger.error('Error en userService.googleAuth:', error);
            throw new ApiError('Error al autenticar con Google', 401);
        }
    }
};

export default userService;
