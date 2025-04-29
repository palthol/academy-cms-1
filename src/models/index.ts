import { Sequelize } from 'sequelize';
import Client from './Client';
import Employee from './Employee';
import Subscription from './Subscription';
import TrainingSession from './TrainingSession';
import PaymentRecord from './PaymentRecord';

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'postgres',
});

// Models are already initialized in their respective files
const models = {
  Client,
  Employee,
  Subscription,
  TrainingSession,
  PaymentRecord,
};

// Set up associations
models.Client.hasMany(models.TrainingSession, { foreignKey: 'clientId' });
models.TrainingSession.belongsTo(models.Client, { foreignKey: 'clientId' });

models.Client.belongsTo(models.Subscription, { foreignKey: 'subscriptionId' });
models.Subscription.hasMany(models.Client, { foreignKey: 'subscriptionId' });

models.Client.hasMany(models.PaymentRecord, { foreignKey: 'clientId' });
models.PaymentRecord.belongsTo(models.Client, { foreignKey: 'clientId' });

models.Employee.hasMany(models.TrainingSession, { foreignKey: 'employeeId' });
models.TrainingSession.belongsTo(models.Employee, { foreignKey: 'employeeId' });

// Export models and sequelize instance
export { sequelize, models };