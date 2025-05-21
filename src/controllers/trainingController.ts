import { Request, Response } from 'express';
import { Op } from 'sequelize';
import TrainingSession from '../models/TrainingSession';
import Client from '../models/Client';
import Employee from '../models/Employee';

// Create a new training session
export const createTrainingSession = async (req: Request, res: Response) => {
    try {
        // Accept all fields from the enhanced TrainingSession model
        const trainingSession = await TrainingSession.create(req.body);
        res.status(201).json(trainingSession);
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
        }
        res.status(500).json({ message: 'Error creating training session', error: error.message });
    }
};

// Get all training sessions
export const getAllTrainingSessions = async (req: Request, res: Response) => {
    try {
        const trainingSessions = await TrainingSession.findAll({
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Employee,
                    as: 'instructor',
                    attributes: ['id', 'name', 'beltRank', 'specialties']
                }
            ]
        });
        res.status(200).json(trainingSessions);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving training sessions', error: error.message });
    }
};

// Get a training session by ID
export const getTrainingSessionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const trainingSession = await TrainingSession.findByPk(id, {
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Employee,
                    as: 'instructor',
                    attributes: ['id', 'name', 'beltRank', 'specialties']
                }
            ]
        });
        
        if (trainingSession) {
            res.status(200).json(trainingSession);
        } else {
            res.status(404).json({ message: 'Training session not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving training session', error: error.message });
    }
};

// Update a training session
export const updateTrainingSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await TrainingSession.update(req.body, {
            where: { id }
        });
        
        if (updated) {
            const updatedTrainingSession = await TrainingSession.findByPk(id, {
                include: [
                    {
                        model: Client,
                        as: 'client',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: Employee,
                        as: 'instructor',
                        attributes: ['id', 'name', 'beltRank', 'specialties']
                    }
                ]
            });
            res.status(200).json(updatedTrainingSession);
        } else {
            res.status(404).json({ message: 'Training session not found' });
        }
    } catch (error: any) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
        }
        res.status(500).json({ message: 'Error updating training session', error: error.message });
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
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting training session', error: error.message });
    }
};

// Get classes by instructor ID
export const getClassesByInstructor = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const classes = await TrainingSession.findAll({
            where: { employeeId },
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name']
                },
                {
                    model: Employee,
                    as: 'instructor',
                    attributes: ['id', 'name', 'beltRank']
                }
            ]
        });
        
        res.status(200).json(classes);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving classes by instructor', error: error.message });
    }
};

// Search training sessions
export const searchTrainingSessions = async (req: Request, res: Response) => {
    try {
        const classTypeParam = typeof req.query.classType === 'string' ? req.query.classType : '';
        const levelParam = typeof req.query.level === 'string' ? req.query.level : '';
        const employeeIdParam = req.query.employeeId ? Number(req.query.employeeId) : undefined;
        const dateParam = typeof req.query.date === 'string' ? req.query.date : undefined;
        const locationParam = typeof req.query.location === 'string' ? req.query.location : '';
        
        const whereClause: any = {};
        
        if (classTypeParam) {
            whereClause.classType = { [Op.iLike]: `%${classTypeParam}%` };
        }
        
        if (levelParam) {
            whereClause.level = { [Op.iLike]: `%${levelParam}%` };
        }
        
        if (employeeIdParam) {
            whereClause.employeeId = employeeIdParam;
        }
        
        if (dateParam) {
            whereClause.date = dateParam;
        }
        
        if (locationParam) {
            whereClause.location = { [Op.iLike]: `%${locationParam}%` };
        }
        
        const trainingSessions = await TrainingSession.findAll({
            where: whereClause,
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Employee,
                    as: 'instructor',
                    attributes: ['id', 'name', 'beltRank', 'specialties']
                }
            ],
            order: [['date', 'ASC'], ['startTime', 'ASC']]
        });
        
        res.status(200).json(trainingSessions);
    } catch (error: any) {
        res.status(500).json({ message: 'Error searching training sessions', error: error.message });
    }
};