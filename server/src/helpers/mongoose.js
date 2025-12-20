import mongoose from 'mongoose';
import logger from './logger.js';

const { MONGO_URI, NODE_ENV } = process.env;

/**
 * Configure mongoose connection
 */
const configure = () => {
    if (!MONGO_URI) {
        logger.error('MONGO_URI environment variable is not defined');
        throw new Error('MONGO_URI is required');
    }

    mongoose.connection.on('connected', () => {
        logger.info('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
    });

    // Connect to MongoDB
    mongoose.connect(MONGO_URI, {
        // Options are no longer needed in Mongoose 8+
    }).catch(err => {
        logger.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });
};

export default {
    configure
};
