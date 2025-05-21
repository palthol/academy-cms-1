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
// Client associations
models.Client.hasMany(models.TrainingSession, { 
  foreignKey: 'clientId',
  as: 'trainingSessions',
  onDelete: 'CASCADE'
});
models.Client.belongsTo(models.Subscription, { 
  foreignKey: 'subscriptionId',
  as: 'subscription'
});
models.Client.hasMany(models.PaymentRecord, { 
  foreignKey: 'clientId',
  as: 'paymentRecords',
  onDelete: 'CASCADE'
});

// Subscription associations
models.Subscription.hasMany(models.Client, { 
  foreignKey: 'subscriptionId',
  as: 'clients'
});

// Employee associations
models.Employee.hasMany(models.TrainingSession, { 
  foreignKey: 'employeeId',
  as: 'trainingSessions'
});

// TrainingSession associations
models.TrainingSession.belongsTo(models.Client, { 
  foreignKey: 'clientId',
  as: 'client'
});
models.TrainingSession.belongsTo(models.Employee, { 
  foreignKey: 'employeeId',
  as: 'instructor'
});

// PaymentRecord associations
models.PaymentRecord.belongsTo(models.Client, { 
  foreignKey: 'clientId',
  as: 'client'
});

// Export models and sequelize instance
export { sequelize, models };
