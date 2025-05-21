import { Router } from 'express';
import { clientController } from '../controllers';
import { validateClientRegistration } from '../middleware/validation';

const router = Router();

// Search route allows filtering clients by multiple parameters:
// - name: Fuzzy search with partial name matching
// - email: Fuzzy search on email addresses
// - city: Filter by city (case-insensitive)
// - state: Filter by state (case-insensitive)
// Example: GET /api/clients/search?name=John&city=Seattle
router.get('/search', clientController.searchClients);

// Route to get all clients
router.get('/', clientController.getClients);

// Route to register a new client
router.post('/', validateClientRegistration, clientController.createClient);

// Route to get a specific client by ID
router.get('/:id', clientController.getClientById);

// Route to update a specific client by ID
router.put('/:id', validateClientRegistration, clientController.updateClient);

// Route to delete a specific client by ID
router.delete('/:id', clientController.deleteClient);

export default router;