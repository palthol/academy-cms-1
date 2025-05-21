import { Request, Response } from 'express';
import { Op } from 'sequelize';
import TrainingSession from '../models/TrainingSession';
import Client from '../models/Client';
import Employee from '../models/Employee';
import logger from '../utils/logger';

// Create a new training session
export const createTrainingSession = async (req: Request, res: Response) => {
    logger.info('Creating new training session', { 
        classType: req.body.classType,
        date: req.body.date,
        employeeId: req.body.employeeId,
        clientId: req.body.clientId
    });
    
    try {
        // Accept all fields from the enhanced TrainingSession model
        const trainingSession = await TrainingSession.create(req.body);
        logger.info('Training session created successfully', { 
            sessionId: trainingSession.id,
            classType: trainingSession.classType,
            date: trainingSession.date
        });
        res.status(201).json(trainingSession);
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'SequelizeValidationError') {
            logger.warn('Training session creation validation failed', {
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message })),
                request: req.body
            });
             res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            }); 
            return;
        }
        logger.error('Error creating training session', {
            error: error.message,
            stack: error.stack,
            request: req.body
        });
        res.status(500).json({ message: 'Error creating training session', error: error.message });
    }
};

// Get all training sessions
export const getAllTrainingSessions = async (req: Request, res: Response) => {
    logger.info('Fetching all training sessions');
    
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
        
        logger.info('Successfully retrieved all training sessions', {
            count: trainingSessions.length
        });
        
        res.status(200).json(trainingSessions);
    } catch (error: any) {
        logger.error('Error retrieving training sessions', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error retrieving training sessions', error: error.message });
    }
};

// Get a training session by ID
export const getTrainingSessionById = async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    logger.info('Fetching training session by ID', { sessionId });
    
    try {
        const trainingSession = await TrainingSession.findByPk(sessionId, {
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
            logger.info('Successfully retrieved training session', { 
                sessionId,
                classType: trainingSession.classType,
                date: trainingSession.date
            });
            res.status(200).json(trainingSession);
        } else {
            logger.warn('Training session not found', { sessionId });
            res.status(404).json({ message: 'Training session not found' });
        }
    } catch (error: any) {
        logger.error('Error retrieving training session', {
            sessionId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error retrieving training session', error: error.message });
    }
};

// Update a training session
export const updateTrainingSession = async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    logger.info('Updating training session', { 
        sessionId,
        fieldsToUpdate: Object.keys(req.body)
    });
    
    try {
        const [updated] = await TrainingSession.update(req.body, {
            where: { id: sessionId }
        });
        
        if (updated) {
            const updatedTrainingSession = await TrainingSession.findByPk(sessionId, {
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
            logger.info('Training session updated successfully', { 
                sessionId,
                classType: updatedTrainingSession?.classType,
                date: updatedTrainingSession?.date
            });
            res.status(200).json(updatedTrainingSession);
        } else {
            logger.warn('Training session not found for update', { sessionId });
            res.status(404).json({ message: 'Training session not found' });
        }
    } catch (error: any) {
        if (error.name === 'SequelizeValidationError') {
            logger.warn('Training session update validation failed', {
                sessionId,
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message })),
                request: req.body
            });
             res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
            return;
        }
        logger.error('Error updating training session', {
            sessionId,
            error: error.message,
            stack: error.stack,
            request: req.body
        });
        res.status(500).json({ message: 'Error updating training session', error: error.message });
    }
};

// Delete a training session
export const deleteTrainingSession = async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    logger.info('Deleting training session', { sessionId });
    
    try {
        const deleted = await TrainingSession.destroy({
            where: { id: sessionId }
        });
        
        if (deleted) {
            logger.info('Training session deleted successfully', { sessionId });
            res.status(204).send();
        } else {
            logger.warn('Training session not found for deletion', { sessionId });
            res.status(404).json({ message: 'Training session not found' });
        }
    } catch (error: any) {
        logger.error('Error deleting training session', {
            sessionId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error deleting training session', error: error.message });
    }
};

// Get classes by instructor ID
export const getClassesByInstructor = async (req: Request, res: Response) => {
    const employeeId = req.params.employeeId;
    logger.info('Fetching classes by instructor ID', { employeeId });
    
    try {
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
        
        logger.info('Successfully retrieved instructor classes', {
            employeeId,
            count: classes.length
        });
        
        res.status(200).json(classes);
    } catch (error: any) {
        logger.error('Error retrieving classes by instructor', {
            employeeId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error retrieving classes by instructor', error: error.message });
    }
};

// Search training sessions
export const searchTrainingSessions = async (req: Request, res: Response) => {
    logger.info('Searching training sessions', { searchParams: req.query });
    
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
        
        logger.info('Training session search completed', { 
            criteria: {
                classType: classTypeParam || undefined,
                level: levelParam || undefined,
                employeeId: employeeIdParam ?? undefined,
                date: dateParam ?? undefined,
                location: locationParam || undefined
            },
            resultsCount: trainingSessions.length
        });
        
        res.status(200).json(trainingSessions);
    } catch (error: any) {
        logger.error('Error searching training sessions', {
            searchParams: req.query,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error searching training sessions', error: error.message });
    }
};