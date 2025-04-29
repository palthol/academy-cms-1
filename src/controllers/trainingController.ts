import { Request, Response } from 'express';
import TrainingSession from '../models/TrainingSession';

// Create a new training session
export const createTrainingSession = async (req: Request, res: Response) => {
    try {
        const { clientId, duration, progress, attendance } = req.body;
        const trainingSession = await TrainingSession.create({ clientId, duration, progress, attendance });
        res.status(201).json(trainingSession);
    } catch (error) {
        res.status(500).json({ message: 'Error creating training session', error });
    }
};

// Get all training sessions
export const getAllTrainingSessions = async (req: Request, res: Response) => {
    try {
        const trainingSessions = await TrainingSession.findAll();
        res.status(200).json(trainingSessions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving training sessions', error });
    }
};

// Get a training session by ID
export const getTrainingSessionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const trainingSession = await TrainingSession.findByPk(id);
        if (trainingSession) {
            res.status(200).json(trainingSession);
        } else {
            res.status(404).json({ message: 'Training session not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving training session', error });
    }
};

// Update a training session
export const updateTrainingSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { clientId, duration, progress, attendance } = req.body;
        const [updated] = await TrainingSession.update({ clientId, duration, progress, attendance }, {
            where: { id }
        });
        if (updated) {
            const updatedTrainingSession = await TrainingSession.findByPk(id);
            res.status(200).json(updatedTrainingSession);
        } else {
            res.status(404).json({ message: 'Training session not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating training session', error });
    }
};

// Delete a training session
export const deleteTrainingSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await TrainingSession.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Training session not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting training session', error });
    }
};