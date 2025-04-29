import { Router } from 'express';
import paymentController from '../controllers/paymentController';

const router = Router();

// Route to register a payment
router.post('/payments', paymentController.createPayment);

// Route to get all payment records
router.get('/payments', paymentController.getAllPayments);

// Route to get a specific payment record by ID
router.get('/payments/:id', paymentController.getPaymentById);

// Route to update a payment record by ID
router.put('/payments/:id', paymentController.updatePayment);

// Route to delete a payment record by ID
router.delete('/payments/:id', paymentController.deletePayment);

export default router;