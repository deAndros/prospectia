export default {
    '/api/leads/discover': {
        post: {
            operationId: 'discover',
            'x-eov-operation-handler': 'handlers/leadHandler',
            summary: 'Discover leads using AI',
            security: [], // No authentication required
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['country', 'niche'],
                            properties: {
                                country: { type: 'string' },
                                niche: { type: 'string' },
                                maxResults: { type: 'integer', default: 5 }
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
                                    leads: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Lead' }
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
    '/api/leads/save': {
        post: {
            operationId: 'save',
            'x-eov-operation-handler': 'handlers/leadHandler',
            summary: 'Save leads to database',
            security: [], // No authentication required
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['leads'],
                            properties: {
                                leads: {
                                    type: 'array',
                                    items: { type: 'object' }
                                },
                                country: { type: 'string' },
                                niche: { type: 'string' },
                                overwrite: { type: 'boolean', default: false }
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
                                    stats: {
                                        type: 'object',
                                        properties: {
                                            new: { type: 'integer' },
                                            updated: { type: 'integer' }
                                        }
                                    },
                                    duplicates: {
                                        type: 'array',
                                        items: { type: 'object' }
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
    '/api/leads': {
        get: {
            operationId: 'getAll',
            'x-eov-operation-handler': 'handlers/leadHandler',
            summary: 'Get all leads',
            security: [], // No authentication required
            responses: {
                200: {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Lead' }
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
    '/api/leads/{id}': {
        put: {
            operationId: 'update',
            'x-eov-operation-handler': 'handlers/leadHandler',
            summary: 'Update lead',
            security: [], // No authentication required
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
                            type: 'object'
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
                                    lead: { $ref: '#/components/schemas/Lead' }
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
        },
        delete: {
            operationId: 'remove',
            'x-eov-operation-handler': 'handlers/leadHandler',
            summary: 'Delete lead',
            security: [], // No authentication required
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
    '/api/leads/{id}/analyze': {
        post: {
            operationId: 'analyze',
            'x-eov-operation-handler': 'handlers/leadHandler',
            summary: 'Analyze lead with AI',
            security: [], // No authentication required
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
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    lead: { $ref: '#/components/schemas/Lead' }
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
    }
};
