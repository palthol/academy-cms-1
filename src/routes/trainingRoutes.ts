import { Router } from 'express';
import { trainingController } from '../controllers';
import { validateTrainingSessionCreation } from '../middleware/validation';

const router = Router();

// Route to create a new training session
router.post('/', validateTrainingSessionCreation, trainingController.createTrainingSession);

// Route to get all training sessions
router.get('/', trainingController.getAllTrainingSessions);

// Route to get a training session by ID
router.get('/:id', trainingController.getTrainingSessionById);

// Route to update a training session
router.put('/:id', trainingController.updateTrainingSession);

// Route to delete a training session
router.delete('/:id', trainingController.deleteTrainingSession);

export default router;