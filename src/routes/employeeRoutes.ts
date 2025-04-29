import { Router } from 'express';
import { employeeController } from '../controllers';

const router = Router();

// Route to create a new employee
router.post('/',employeeController.createEmployee);

// Route to get all employees
router.get('/', getEmployees);

// Route to get a specific employee by ID
router.get('/:id', getEmployeeById);

// Route to update an employee by ID
router.put('/:id', updateEmployee);

// Route to delete an employee by ID
router.delete('/:id', deleteEmployee);

export default router;