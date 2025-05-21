import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Employee from '../models/Employee';
import TrainingSession from '../models/TrainingSession';

// Create a new employee
export const createEmployee = async (req: Request, res: Response) => {
    try {
        // Accept all fields from request body
        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
};

// Get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await Employee.findAll({
            include: [{
                model: TrainingSession,
                as: 'trainingSessions',
                attributes: ['id', 'name', 'date', 'startTime', 'endTime'],
                limit: 5 // Only include recent sessions
            }]
        });
        res.status(200).json(employees);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving employees', error: error.message });
    }
};

// Get active instructors
export const getActiveInstructors = async (req: Request, res: Response) => {
    try {
        const instructors = await Employee.findAll({
            where: {
                isActive: true,
                role: 'Instructor'
            }
        });
        res.status(200).json(instructors);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving instructors', error: error.message });
    }
};

// Get a single employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id, {
            include: [{
                model: TrainingSession,
                as: 'trainingSessions'
            }]
        });
        
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving employee', error: error.message });
    }
};

// Update an employee
export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await Employee.update(req.body, { 
            where: { id } 
        });
        
        if (updated) {
            const updatedEmployee = await Employee.findByPk(id);
            res.status(200).json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error: any) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
        }
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
};

// Delete an employee
export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Employee.destroy({ where: { id } });
        
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
};

// Search employees
export const searchEmployees = async (req: Request, res: Response) => {
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
        
        res.status(200).json(employees);
    } catch (error: any) {
        res.status(500).json({ message: 'Error searching employees', error: error.message });
    }
};