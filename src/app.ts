import express from 'express';
import { json, urlencoded } from 'body-parser';
import clientRoutes from './routes/clientRoutes';
import employeeRoutes from './routes/employeeRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import trainingRoutes from './routes/trainingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;