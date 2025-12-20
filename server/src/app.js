import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import * as middleware from 'express-openapi-validator';

import logger from '#helpers/logger.js';
import mongoose from '#helpers/mongoose.js';
import Router from '#routes/index.js';
import apiSpec from '#openapi/index.js';
import { packageJson } from '#util/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const {
    NODE_ENV = 'development',
    PORT = 5000,
    BODY_LIMIT = '10mb'
} = process.env;

const pkg = packageJson();
const IS_WINDOWS = process.platform === 'win32';

// Map to store resolved route handlers
const Routes = new Map();

class App {
    constructor() {
        this.app = express();
        this._onListening = this._onListening.bind(this);
        this._onError = this._onError.bind(this);
    }

    _onListening() {
        logger.info(`==============================================`);
        logger.info(`🚀 ${pkg.name} v${pkg.version}`);
        logger.info(`📡 Server listening on port ${PORT}`);
        logger.info(`🌍 Environment: ${NODE_ENV}`);
        logger.info(`📚 API Docs: http://localhost:${PORT}/docs`);
        logger.info(`==============================================`);
    }

    _onError(err) {
        logger.error(`App Crashed, Error: ${err.message}`);
        process.exit(1);
    }

    init() {
        if (NODE_ENV !== 'test') {
            this._configure();
            this.app.listen(PORT, this._onListening);
            this.app.on('error', this._onError);
            return this.app;
        }
    }

    _configure() {
        mongoose.configure();
        this._middleWares();
        return this._routes();
    }

    _middleWares() {
        // Body parser
        this.app.use(express.json({ limit: BODY_LIMIT }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());

        // CORS configuration
        if (NODE_ENV === 'development') {
            this.app.use(cors({
                credentials: true,
                origin: /^http:\/\/localhost/
            }));
        } else if (NODE_ENV !== 'test') {
            this.app.disable('x-powered-by');
            this.app.use(helmet());
            this.app.use(helmet.noSniff());
            this.app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
            
            // You can configure CORS whitelist here for production
            this.app.use(cors({
                credentials: true,
                origin: process.env.ALLOWED_ORIGINS?.split(',') || []
            }));
        }

        // AUTHENTICATION MIDDLEWARE (COMMENTED - Ready to use when needed)
        // To enable authentication, uncomment the lines below:
        // import { authenticate } from '#routes/middleWares/index.js';
        // this.app.use('/api/leads', authenticate); // Protect all /api/leads routes
        // 
        // Then, remove "security: []" from  endpoints in openapi/api/leads.js
        // to enforce authentication via OpenAPI spec
    }

    _routes() {
        // API Documentation endpoint
        this.app.get('/docs', (_, res) => {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${pkg.name} API Documentation</title>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <style>
                        body { margin: 0; padding: 0; }
                    </style>
                </head>
                <body>
                    <div id="redoc-container"></div>
                    <script src="https://unpkg.com/redoc@latest/bundles/redoc.standalone.js"></script>
                    <script>
                        Redoc.init('/docs/swagger.json', {
                            expandResponses: '200,201',
                            hideDownloadButton: false,
                            pathInMiddlePanel: true,
                            requiredPropsFirst: true,
                            sortPropsAlphabetically: true,
                            theme: {
                                colors: {
                                    primary: { main: '#2c3e50' }
                                }
                            }
                        }, document.getElementById('redoc-container'));
                    </script>
                </body>
                </html>
            `);
        });

        const basePath = join(__dirname);

        // Expose OpenAPI spec
        this.app.get('/docs/swagger.json', (_, res) => res.json(apiSpec));
        this.app.get('/openapi.json', (_, res) => res.json(apiSpec));

        // OpenAPI validator and operation handler
        this.app.use(middleware.middleware({
            apiSpec,
            validateRequests: true,
            validateResponses: false,
            operationHandlers: {
                basePath,
                resolver: (basePath, route, apiDoc) => {
                    const pathKey = route.openApiRoute.substring(route.basePath.length);
                    const schema = apiDoc.paths[pathKey]?.[route.method.toLowerCase()];
                    
                    if (!schema) {
                        throw new Error(`No schema found for ${route.method} ${pathKey}`);
                    }

                    const fn = schema['x-eov-operation-id'] || schema['operationId'];

                    if (Routes.has(fn)) {
                        return Routes.get(fn);
                    }

                    const handler = schema['x-eov-operation-handler'] || 'handlers';
                    const routes = fn.split('/');
                    const functionName = routes.pop();
                    let modulePath = join(basePath, handler, ...routes);

                    if (fs.statSync(modulePath, { throwIfNoEntry: false })?.isDirectory()) {
                        modulePath += '/index.js';
                    } else {
                        modulePath += '.js';
                    }

                    if (IS_WINDOWS || modulePath.startsWith('/')) {
                        modulePath = 'file://' + modulePath;
                    }

                    const modP = import(modulePath);
                    return async (req, res, next) => {
                        try {
                            let mod = await modP;
                            if (mod.default) {
                                mod = mod.default;
                            }

                            Routes.set(fn, mod[functionName]);
                            mod[functionName](req, res, next);
                        } catch (error) {
                            logger.error(`Routing error: ${modulePath} ||| ${functionName}`, error);
                            next(new Error(`Routing error ${modulePath} ||| ${functionName}`));
                        }
                    };
                }
            }
        }));

        // Additional routes (fallbacks, etc.)
        Router.configure(this.app);
    }
}

export default App;
