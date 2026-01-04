import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Formato personalizado para salida de consola
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

// Crear instancia de logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        // Transporte de consola
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                consoleFormat
            )
        })
    ]
});

// Agregar transportes de archivo en producción
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error' 
    }));
    logger.add(new winston.transports.File({ 
        filename: 'logs/combined.log' 
    }));
}

export default logger;
