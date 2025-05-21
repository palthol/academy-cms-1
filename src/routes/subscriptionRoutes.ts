import { Router } from 'express';
import { subscriptionController } from '../controllers';
import { validateSubscriptionCreation } from '../middleware/validation';

const router = Router();

// Search subscriptions with filtering by name, price range, and active status
// Example: GET /api/subscriptions/search?name=Basic&minPrice=50&maxPrice=100&active=true
router.get('/search', subscriptionController.searchSubscriptions);

// Get all subscription plans
// Returns a list of all subscription plans with basic details
router.get('/', subscriptionController.getAllSubscriptions);

// Create a new subscription plan with validation
// Requires name, price, and duration at minimum
router.post('/', validateSubscriptionCreation, subscriptionController.createSubscription);

// Get all clients enrolled in a specific subscription plan
// Returns client details for the specified subscription
// Example: GET /api/subscriptions/5/clients
router.get('/:id/clients', subscriptionController.getClientsBySubscription);

// Get detailed information about a specific subscription plan
router.get('/:id', subscriptionController.getSubscriptionById);

// Update a subscription plan with validation
// Can modify price, features, and availability
router.put('/:id', validateSubscriptionCreation, subscriptionController.updateSubscription);

// Delete a subscription plan
// Note: Only allows deletion if no clients are currently using this plan
router.delete('/:id', subscriptionController.deleteSubscription);

export default router;