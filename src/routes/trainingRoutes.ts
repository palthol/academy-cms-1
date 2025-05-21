import { Router } from 'express';
import { trainingController } from '../controllers';
import { validateTrainingSessionCreation } from '../middleware/validation';

const router = Router();

// Search training sessions with filtering by class type, level, date, and location
// Example: GET /api/training/search?classType=BJJ&level=beginner
router.get('/search', trainingController.searchTrainingSessions);

// Get classes taught by a specific instructor
// Returns all training sessions for the specified employee ID
// Example: GET /api/training/instructor/5
router.get('/instructor/:employeeId', trainingController.getClassesByInstructor);

// Get all training sessions with instructor and client details
router.get('/', trainingController.getAllTrainingSessions);

// Create a new training session with validation
// Requires class type, date, start/end times, and instructor ID
router.post('/', validateTrainingSessionCreation, trainingController.createTrainingSession);

// Get detailed information about a specific training session
router.get('/:id', trainingController.getTrainingSessionById);

// Update a training session with validation
// Can modify schedule, attendance, and other session details
router.put('/:id', validateTrainingSessionCreation, trainingController.updateTrainingSession);

// Delete a training session
router.delete('/:id', trainingController.deleteTrainingSession);

export default router;