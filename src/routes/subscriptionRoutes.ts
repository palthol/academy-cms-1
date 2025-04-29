import { Router } from 'express';
import { subscriptionController } from '../controllers';

const router = Router();

// Route to create a new subscription
router.post('/', subscriptionController.createSubscription);

// Route to get all subscriptions
router.get('/', subscriptionController.getSubscriptions);

// Route to get a subscription by ID
router.get('/:id', subscriptionController.getSubscriptionById);

// Route to update a subscription by ID
router.put('/:id', subscriptionController.updateSubscription);

// Route to delete a subscription by ID
router.delete('/:id', subscriptionController.deleteSubscription);

export default router;