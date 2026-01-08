import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, ingrese un correo electrónico válido']
    },
    passwordHash: {
        type: String,
        // Opcional porque puede ser un usuario solo de Google inicialmente
        required: function() {
            return this.authProviders.includes('LOCAL') && !this.googleId;
        }
    },
    authProviders: {
        type: [String],
        enum: ['LOCAL', 'GOOGLE'],
        default: ['LOCAL'],
        required: true
    },
    // ID de Google para futuros usos si se implementa login social
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerifiedAt: {
        type: Date
    },
    lastLoginAt: {
        type: Date
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    profileImage: {
        type: String,
        // Almacena imagen como base64 o URL
        default: null
    }
}, {
    timestamps: true, // Crea createdAt y updatedAt automáticamente
    versionKey: false
});

// Índice para búsquedas rápidas por email
userSchema.index({ email: 1 });

/**
 * Método para retornar datos públicos del usuario (sin password, etc)
 */
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.passwordHash;
    delete user.failedLoginAttempts;
    delete user.lockUntil;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
