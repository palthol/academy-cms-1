import { Request, Response } from 'express';
import Employee from '../models/Employee';

// Create a new employee
export const createEmployee = async (req: Request, res: Response) => {
    try {
        const { name, role, schedule } = req.body;
        const newEmployee = await Employee.create({ name, role, schedule });
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Error creating employee', error });
    }
};

// Get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await Employee.findAll();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving employees', error });
    }
};

// Get a single employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving employee', error });
    }
};

// Update an employee
export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, role, schedule } = req.body;
        const [updated] = await Employee.update({ name, role, schedule }, { where: { id } });
        if (updated) {
            const updatedEmployee = await Employee.findByPk(id);
            res.status(200).json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error });
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
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
};