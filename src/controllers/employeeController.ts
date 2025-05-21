import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Employee from '../models/Employee';
import TrainingSession from '../models/TrainingSession';
import logger from '../utils/logger';

// Create a new employee
export const createEmployee = async (req: Request, res: Response) => {
    logger.info('Creating new employee', { 
        email: req.body.email,
        name: req.body.name,
        role: req.body.role
    });
    
    try {
        // Accept all fields from request body
        const employee = await Employee.create(req.body);
        logger.info('Employee created successfully', {
            employeeId: employee.id,
            email: employee.email,
            role: employee.role
        });
        res.status(201).json(employee);
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'SequelizeValidationError') {
            logger.warn('Employee creation validation failed', {
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message })),
                request: req.body
            });
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            logger.warn('Employee creation failed - Email already in use', {
                email: req.body.email
            });
            return res.status(409).json({ message: 'Email already in use' });
        }
        logger.error('Error creating employee', {
            error: error.message,
            stack: error.stack,
            request: req.body
        });
        res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
};

// Get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
    logger.info('Fetching all employees');
    
    try {
        const employees = await Employee.findAll({
            include: [{
                model: TrainingSession,
                as: 'trainingSessions',
                attributes: ['id', 'name', 'date', 'startTime', 'endTime'],
                limit: 5 // Only include recent sessions
            }]
        });
        
        logger.info('Successfully retrieved all employees', {
            count: employees.length
        });
        
        res.status(200).json(employees);
    } catch (error: any) {
        logger.error('Error retrieving employees', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error retrieving employees', error: error.message });
    }
};

// Get active instructors
export const getActiveInstructors = async (req: Request, res: Response) => {
    logger.info('Fetching active instructors');
    
    try {
        const instructors = await Employee.findAll({
            where: {
                isActive: true,
                role: 'Instructor'
            }
        });
        
        logger.info('Successfully retrieved active instructors', {
            count: instructors.length
        });
        
        res.status(200).json(instructors);
    } catch (error: any) {
        logger.error('Error retrieving active instructors', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error retrieving instructors', error: error.message });
    }
};

// Get a single employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
    const employeeId = req.params.id;
    logger.info('Fetching employee by ID', { employeeId });
    
    try {
        const employee = await Employee.findByPk(employeeId, {
            include: [{
                model: TrainingSession,
                as: 'trainingSessions'
            }]
        });
        
        if (employee) {
            logger.info('Successfully retrieved employee', { 
                employeeId,
                name: employee.name,
                role: employee.role
            });
            res.status(200).json(employee);
        } else {
            logger.warn('Employee not found', { employeeId });
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error: any) {
        logger.error('Error retrieving employee by ID', {
            employeeId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error retrieving employee', error: error.message });
    }
};

// Update an employee
export const updateEmployee = async (req: Request, res: Response) => {
    const employeeId = req.params.id;
    logger.info('Updating employee', { 
        employeeId,
        fieldsToUpdate: Object.keys(req.body)
    });
    
    try {
        const [updated] = await Employee.update(req.body, { 
            where: { id: employeeId } 
        });
        
        if (updated) {
            const updatedEmployee = await Employee.findByPk(employeeId);
            logger.info('Employee updated successfully', { 
                employeeId,
                name: updatedEmployee?.name 
            });
            res.status(200).json(updatedEmployee);
        } else {
            logger.warn('Employee not found for update', { employeeId });
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error: any) {
        if (error.name === 'SequelizeValidationError') {
            logger.warn('Employee update validation failed', {
                employeeId,
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message })),
                request: req.body
            });
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
        }
        logger.error('Error updating employee', {
            employeeId,
            error: error.message,
            stack: error.stack,
            request: req.body
        });
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
};

// Delete an employee
export const deleteEmployee = async (req: Request, res: Response) => {
    const employeeId = req.params.id;
    logger.info('Deleting employee', { employeeId });
    
    try {
        const deleted = await Employee.destroy({ where: { id: employeeId } });
        
        if (deleted) {
            logger.info('Employee deleted successfully', { employeeId });
            res.status(204).send();
        } else {
            logger.warn('Employee not found for deletion', { employeeId });
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error: any) {
        logger.error('Error deleting employee', {
            employeeId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
};

// Search employees
export const searchEmployees = async (req: Request, res: Response) => {
    logger.info('Searching employees', { searchParams: req.query });
    
    try {
        // Type-safe query parameter handling
        const nameParam = typeof req.query.name === 'string' ? req.query.name : '';
        const roleParam = typeof req.query.role === 'string' ? req.query.role : '';
        const beltRankParam = typeof req.query.beltRank === 'string' ? req.query.beltRank : '';
        const specialtyParam = typeof req.query.specialty === 'string' ? req.query.specialty : '';
        
        const whereClause: any = {};
        
        if (nameParam) {
            whereClause.name = { [Op.iLike]: `%${nameParam}%` };
        }
        
        if (roleParam) {
            whereClause.role = { [Op.iLike]: `%${roleParam}%` };
        }
        
        if (beltRankParam) {
            whereClause.beltRank = { [Op.iLike]: `%${beltRankParam}%` };
        }
        
        if (specialtyParam) {
            whereClause.specialties = { [Op.iLike]: `%${specialtyParam}%` };
        }
        
        const employees = await Employee.findAll({
            where: whereClause,
            include: [{
                model: TrainingSession,
                as: 'trainingSessions',
                attributes: ['id', 'name', 'date', 'startTime', 'endTime'],
                limit: 3
            }]
        });
        
        logger.info('Employee search completed', { 
            criteria: {
                name: nameParam || undefined,
                role: roleParam || undefined,
                beltRank: beltRankParam || undefined,
                specialty: specialtyParam || undefined
            },
            resultsCount: employees.length
        });
        
        res.status(200).json(employees);
    } catch (error: any) {
        logger.error('Error searching employees', {
            searchParams: req.query,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error searching employees', error: error.message });
    }
};