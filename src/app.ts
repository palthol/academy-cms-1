// This file sets up the Express application with routes and middleware.

import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import { 
  clientRoutes, 
  employeeRoutes, 
  subscriptionRoutes, 
  trainingRoutes, 
  paymentRoutes 
} from './routes';
import errorHandler from './middleware/errorHandler';
import logger from './utils/logger';

const app = express();

// Middleware setup
app.use(cors());  // Enable CORS for all routes
app.use(json());  // Parse JSON request bodies
app.use(urlencoded({ extended: true }));  // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    ip: req.ip
  });
  next();
});

// Routes are mounted here
app.use('/api/clients', clientRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/payments', paymentRoutes);

// Global error handler
app.use(errorHandler);

export default app;