export default {
    User: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            authProviders: {
                type: 'array',
                items: {
                    type: 'string',
                    enum: ['LOCAL', 'GOOGLE']
                }
            },
            emailVerified: { type: 'boolean' },
            lastLoginAt: { type: 'string', format: 'date-time' },
            profileImage: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },
    RegisterRequest: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'password'],
        properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 }
        }
    },
    LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
        }
    },
    UpdateProfileRequest: {
        type: 'object',
        properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            profileImage: { type: 'string', nullable: true }
        }
    },
    AuthResponse: {
        type: 'object',
        properties: {
            code: { type: 'integer' },
            message: { type: 'string' },
            data: {
                type: 'object',
                properties: {
                    user: { $ref: '#/components/schemas/User' },
                    token: { type: 'string' }
                }
            }
        }
    }
};
