import components from './components/index.js';
import publicApi from './publicApi.js';
import api from './api/index.js';
import back from './back/index.js';
import { packageJson } from '#util/index.js';

const pkg = packageJson();

const { PORT = 5000, DOMAIN = `http://localhost:${PORT}` } = process.env;

export default {
    openapi: '3.0.1',
    info: {
        title: pkg.description || 'Prospect Compass API',
        version: pkg.version
    },
    servers: [
        { url: `http://localhost:${PORT}` },
        { url: DOMAIN }
    ],
    // Security is defined but NOT applied by default (all endpoints have security: [])
    // To enable authentication, remove security: [] from specific endpoints in openapi/api/leads.js
    security: [],
    paths: {
        '/ping': {
            get: {
                operationId: 'ping',
                'x-eov-operation-handler': 'handlers/status',
                security: [],
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { version: { type: 'string' } }
                                }
                            }
                        }
                    },
                    default: {
                        description: 'Error',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
                    }
                }
            }
        },
        '/ready': {
            get: {
                operationId: 'getStatus',
                'x-eov-operation-handler': 'handlers/status',
                security: [],
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        status: { type: 'string' },
                                        deps: {
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
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
                    }
                }
            }
        },
        '/health': {
            get: {
                operationId: 'getHealth',
                'x-eov-operation-handler': 'handlers/status',
                security: [],
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        status: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    default: {
                        description: 'Error',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
                    }
                }
            }
        },
        ...publicApi,
        ...api,
        ...back
    },
    components
};
