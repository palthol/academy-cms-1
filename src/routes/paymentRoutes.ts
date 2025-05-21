import { Router } from 'express';
import { paymentController } from '../controllers';
import { validatePaymentRecordCreation } from '../middleware/validation';

const router = Router();

// Search payments with advanced filtering options
// Supports filtering by clientId, status, date range, and amount range
// Example: GET /api/payments/search?status=completed&minAmount=100&maxAmount=500
router.get('/search', paymentController.searchPayments);

// Get all payments for a specific client
// Returns payment history in descending date order
// Example: GET /api/payments/client/123
router.get('/client/:clientId', paymentController.getPaymentsByClientId);

// Get all payment records with pagination support
router.get('/', paymentController.getAllPayments);

// Create a new payment record with validation
router.post('/', validatePaymentRecordCreation, paymentController.createPayment);

// Get detailed information about a specific payment
router.get('/:id', paymentController.getPaymentById);

// Update payment information with validation
// Supports status updates and payment amount corrections
router.put('/:id', validatePaymentRecordCreation, paymentController.updatePayment);

// Delete a payment record (soft delete recommended in production)
router.delete('/:id', paymentController.deletePayment);

export default router;