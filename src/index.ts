/**
 * Application Entry Point
 * Sets up server, connects to database, and handles process lifecycle
 */

// --------------------------
// IMPORTS & CONFIGURATION
// --------------------------
import connectToDatabase, { closeConnection, testConnection } from './config/database';
import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT ?? 3000;
let server: any;

// --------------------------
// ERROR HANDLING
// --------------------------
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { 
    error: error.message,
    stack: error.stack
  });
  
  // Give the logger time to flush before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', { 
    reason,
    promise
  });
});

// --------------------------
// DATABASE HEALTH CHECK
// --------------------------
app.get('/db-health', async (req, res) => {
  const isConnected = await testConnection();
  if (isConnected) {
    logger.info('Database health check succeeded');
    res.status(200).json({ status: 'Database connection is healthy' });
  } else {
    logger.error('Database health check failed');
    res.status(500).json({ status: 'Database connection failed' });
  }
});

// --------------------------
// GRACEFUL SHUTDOWN
// --------------------------
const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully...');
  
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      
      closeConnection().then(() => {
        logger.info('Database connection closed');
        logger.info('Process terminated successfully');
        process.exit(0);
      }).catch(err => {
        logger.error('Error during database shutdown', {
          error: err.message,
          stack: err.stack
        });
        process.exit(1);
      });
    });
    
    // Force close server after 10 seconds if it hasn't closed gracefully
    setTimeout(() => {
      logger.warn('Server did not close gracefully, forcing shutdown');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// --------------------------
// SIGNAL HANDLING
// --------------------------
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// --------------------------
// APPLICATION STARTUP
// --------------------------
// Log application startup information
logger.info('Application starting', {
  environment: process.env.NODE_ENV ?? 'development',
  nodeVersion: process.version,
  port: PORT
});

// Connect to the database, then start the server
connectToDatabase()
  .then(() => {
    server = app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
    
    // Set server timeout settings
    server.timeout = 30000; // 30 second timeout
  })
  .catch(error => {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  });

// --------------------------
// MEMORY USAGE MONITORING
// --------------------------
// Log memory usage every hour
setInterval(() => {
  const memoryUsage = process.memoryUsage();
  logger.info('Memory usage stats', {
    rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
  });
}, 60 * 60 * 1000); // Every hour