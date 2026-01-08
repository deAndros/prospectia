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
    },
    '/users/google-auth': {
        post: {
            operationId: 'googleAuth',
            'x-eov-operation-handler': 'controllers/userController',
            summary: 'Autenticación con Google',
            description: 'Autenticar o registrar usuario mediante un idToken de Google',
            security: [],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/GoogleAuthRequest'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Autenticación exitosa',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthResponse'
                            }
                        }
                    }
                },
                401: {
                    description: 'Token de Google inválido',
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
    '/api/users/profile': {
        patch: {
            operationId: 'updateProfile',
            'x-eov-operation-handler': 'controllers/userController',
            summary: 'Actualizar perfil de usuario',
            description: 'Permite al usuario actualizar su nombre, apellido, email y foto de perfil',
            // Requiere autenticación JWT
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/UpdateProfileRequest'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Perfil actualizado exitosamente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer' },
                                    message: { type: 'string' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            user: { $ref: '#/components/schemas/User' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Error de validación o imagen demasiado grande',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                401: {
                    description: 'No autenticado',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                404: {
                    description: 'Usuario no encontrado',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                409: {
                    description: 'El correo electrónico ya está registrado por otro usuario',
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
