import { Router } from 'express';
import { paymentController } from '../controllers';
import { validatePaymentRecordCreation } from '../middleware/validation';


const router = Router();

// Route to register a payment
router.post('/', validatePaymentRecordCreation, paymentController.createPayment);

// Route to get all payment records
router.get('/', paymentController.getAllPayments);

// Route to get a specific payment record by ID
router.get('/:id', paymentController.getPaymentById);

// Route to update a payment record by ID
router.put('/:id', paymentController.updatePayment);

// Route to delete a payment record by ID
router.delete('/:id', paymentController.deletePayment);

export default router;