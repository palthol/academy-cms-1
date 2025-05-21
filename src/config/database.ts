/**
 * Database Configuration
 * Sets up Sequelize with connection pool and handles connection lifecycle
 */

// --------------------------
// IMPORTS & CONFIGURATION
// --------------------------
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

// --------------------------
// CONNECTION CONFIGURATION
// --------------------------
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'production' ? false : (msg) => logger.debug(msg),
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : undefined
    }
  }
);

// --------------------------
// CONNECTION MANAGEMENT
// --------------------------

/**
 * Connect and initialize the database connection
 * @returns Sequelize instance
 */
const connectToDatabase = async () => {
  const maxRetries = 5;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      await sequelize.authenticate();
      logger.info('Database connection established successfully', {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        attempt: retries + 1
      });
      return sequelize;
    } catch (error: any) {
      retries++;
      logger.error('Database connection attempt failed', {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        attempt: retries,
        maxRetries,
        error: error.message,
        stack: error.stack
      });
      
      if (retries >= maxRetries) {
        logger.error('Maximum connection retries reached, giving up');
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, retries), 10000);
      logger.info(`Retrying connection in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // This should never be reached due to the throw above, but TypeScript needs a return
  throw new Error('Failed to connect to database after maximum retries');
};

/**
 * Test connection without fully initializing the app
 * Useful for CI/CD pipelines or health checks
 * @returns boolean indicating connection success
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection test successful', {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME
    });
    return true;
  } catch (error: any) {
    logger.error('Database connection test failed', {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      error: error.message
    });
    return false;
  }
};

/**
 * Gracefully close the database connection
 * @returns boolean indicating successful closure
 */
const closeConnection = async () => {
  try {
    await sequelize.close();
    logger.info('Database connection closed successfully', {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME
    });
    return true;
  } catch (error: any) {
    logger.error('Error closing database connection', {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      error: error.message,
      stack: error.stack
    });
    return false;
  }
};

export default connectToDatabase;
export { sequelize, testConnection, closeConnection };