import { Router } from 'express';
import { 
  createSubscription, 
  getSubscriptions, 
  getSubscriptionById, 
  updateSubscription, 
  deleteSubscription 
} from '../controllers/subscriptionController';

const router = Router();

// Route to create a new subscription
router.post('/', createSubscription);

// Route to get all subscriptions
router.get('/', getSubscriptions);

// Route to get a subscription by ID
router.get('/:id', getSubscriptionById);

// Route to update a subscription by ID
router.put('/:id', updateSubscription);

// Route to delete a subscription by ID
router.delete('/:id', deleteSubscription);

export default router;