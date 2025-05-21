import { Router } from 'express';
import { employeeController } from '../controllers';
import { validateEmployeeCreation } from '../middleware/validation';

const router = Router();

// Search route for employees - filters by name, email, role, or specialty
// Example: GET /api/employees/search?name=Smith&role=instructor
router.get('/search', employeeController.searchEmployees);

// Route to get only active instructors with their qualifications
// Used for class scheduling and client-facing instructor lists
router.get('/instructors/active', employeeController.getActiveInstructors);

// Route to get all employees with basic information
router.get('/', employeeController.getAllEmployees);

// Route to create a new employee with validation
router.post('/', validateEmployeeCreation, employeeController.createEmployee);

// Route to get detailed information for a specific employee by ID
router.get('/:id', employeeController.getEmployeeById);

// Route to update an employee's information with validation
router.put('/:id', validateEmployeeCreation, employeeController.updateEmployee);

// Route to delete an employee by ID
router.delete('/:id', employeeController.deleteEmployee);

export default router;