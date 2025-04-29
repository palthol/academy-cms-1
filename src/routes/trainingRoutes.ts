import { Router } from 'express';
import { 
    createTrainingSession, 
    getTrainingSessions, 
    getTrainingSessionById, 
    updateTrainingSession, 
    deleteTrainingSession 
} from '../controllers/trainingController';

const router = Router();

// Route to create a new training session
router.post('/', createTrainingSession);

// Route to get all training sessions
router.get('/', getTrainingSessions);

// Route to get a training session by ID
router.get('/:id', getTrainingSessionById);

// Route to update a training session
router.put('/:id', updateTrainingSession);

// Route to delete a training session
router.delete('/:id', deleteTrainingSession);

export default router;