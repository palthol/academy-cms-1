import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

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
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
  }
);

// Connect and test the database connection
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Test connection without fully initializing the app
// Useful for CI/CD pipelines or health checks
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection test successful.');
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

// Gracefully close the connection
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed successfully.');
    return true;
  } catch (error) {
    console.error('Error closing database connection:', error);
    return false;
  }
};

export default connectToDatabase;
export { sequelize, testConnection, closeConnection };