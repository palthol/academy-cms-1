import { Router } from 'express';
import { clientController } from '../controllers';


const router = Router();

// Route to register a new client
router.post('/', clientController.createClient);

// Route to get a specific client by ID
router.get('/:id', clientController.getClientById);

// Route to update a specific client by ID
router.put('/:id', clientController.updateClient);

// Route to delete a specific client by ID
router.delete('/:id', clientController.deleteClient);

// Route to get all clients
router.get('/', clientController.getClients);

export default router;