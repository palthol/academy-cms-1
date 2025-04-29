import { Router } from 'express';
import clientRoutes from './clientRoutes';
import employeeRoutes from './employeeRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import trainingRoutes from './trainingRoutes';
import paymentRoutes from './paymentRoutes';

const router = Router();

// Link routes to their respective controllers
router.use('/clients', clientRoutes);
router.use('/employees', employeeRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/training-sessions', trainingRoutes);
router.use('/payments', paymentRoutes);

export default router;