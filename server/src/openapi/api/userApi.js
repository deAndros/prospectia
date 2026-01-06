export default {
    '/users/register': {
        post: {
            operationId: 'register',
            'x-eov-operation-handler': 'controllers/userController',
            summary: 'Registrar nuevo usuario',
            description: 'Crea una nueva cuenta de usuario con credenciales locales',
            security: [], // Endpoint público
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/RegisterRequest'
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Usuario registrado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthResponse'
                            }
                        }
                    }
                },
                400: {
                    description: 'Error de validación',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                409: {
                    description: 'El correo electrónico ya está registrado',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                default: {
                    description: 'Error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                }
            }
        }
    },
    '/users/login': {
        post: {
            operationId: 'login',
            'x-eov-operation-handler': 'controllers/userController',
            summary: 'Iniciar sesión',
            description: 'Autenticar usuario y retornar token JWT',
            security: [], // Endpoint público
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/LoginRequest'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Inicio de sesión exitoso',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthResponse'
                            }
                        }
                    }
                },
                401: {
                    description: 'Credenciales inválidas',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                default: {
                    description: 'Error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                }
            }
        }
    }
};
