import { Router } from 'express';
import { employeeController } from '../controllers';
import { validateEmployeeCreation } from '../middleware/validation';


const router = Router();

// Route to create a new employee
router.post('/', validateEmployeeCreation, employeeController.createEmployee);

// Route to get all employees
router.get('/', employeeController.getAllEmployees);

// Route to get a specific employee by ID
router.get('/:id', employeeController.getEmployeeById);

// Route to update an employee by ID
router.put('/:id', employeeController.updateEmployee);

// Route to delete an employee by ID
router.delete('/:id', employeeController.deleteEmployee);

export default router;