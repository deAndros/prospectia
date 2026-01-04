export default {
    '/api/lists': {
        get: {
            operationId: 'getAll',
            'x-eov-operation-handler': 'handlers/listHandler',
            summary: 'Get all active lists',
            security: [],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/List' }
                            }
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
        },
        post: {
            operationId: 'create',
            'x-eov-operation-handler': 'handlers/listHandler',
            summary: 'Create a new list',
            security: [],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['name'],
                            properties: {
                                name: { type: 'string' },
                                prospects: {
                                    type: 'array',
                                    items: { type: 'string' }
                                },
                                country: { type: 'string' },
                                niche: { type: 'string' },
                                scoreMin: { type: 'number' },
                                scoreMax: { type: 'number' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Created',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    list: { $ref: '#/components/schemas/List' }
                                }
                            }
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
    '/api/lists/options': {
        get: {
            operationId: 'options',
            'x-eov-operation-handler': 'handlers/listHandler',
            summary: 'Get available niches and countries for list creation',
            security: [],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    countries: {
                                        type: 'array',
                                        items: { type: 'string' }
                                    },
                                    niches: {
                                        type: 'array',
                                        items: { type: 'string' }
                                    }
                                }
                            }
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
    '/api/lists/{id}': {
        get: {
            operationId: 'getOne',
            'x-eov-operation-handler': 'handlers/listHandler',
            summary: 'Get list by id',
            security: [],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' }
                }
            ],
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/List' }
                        }
                    }
                },
                404: {
                    description: 'Not found',
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
        },
        put: {
            operationId: 'update',
            'x-eov-operation-handler': 'handlers/listHandler',
            summary: 'Update list name or prospects (Custom only)',
            security: [],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                prospects: {
                                    type: 'array',
                                    items: { type: 'string' }
                                },
                                country: { type: 'string' },
                                niche: { type: 'string' },
                                scoreMin: { type: 'number' },
                                scoreMax: { type: 'number' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    list: { $ref: '#/components/schemas/List' }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Not found',
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
        },
        delete: {
            operationId: 'remove',
            'x-eov-operation-handler': 'handlers/listHandler',
            summary: 'Soft delete a list',
            security: [],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' }
                }
            ],
            responses: {
                200: {
                    description: 'Deleted',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Not found',
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

