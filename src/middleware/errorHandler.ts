import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Global error handler middleware
 * Logs errors with structured information and returns appropriate responses
 */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Log error with structured context data
    logger.error('Unhandled exception', { 
        path: req.path,
        method: req.method,
        query: req.query,
        ip: req.ip,
        statusCode: err.statusCode ?? 500,
        errorName: err.name,
        errorMessage: err.message,
        stack: err.stack
    });
    
    // Set status code from error if available, default to 500
    const statusCode = err.statusCode ?? 500;
    
    // Send response with appropriate information based on environment
    res.status(statusCode).json({
        message: err.message ?? 'An unexpected error occurred.',
        error: process.env.NODE_ENV === 'development' ? {
            stack: err.stack,
            name: err.name
        } : {}
    });
};

export default errorHandler;