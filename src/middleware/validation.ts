import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Common validation error handler
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Middleware for validating client registration
export const validateClientRegistration = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('address').isString().notEmpty().withMessage('Address is required'),
  body('city').isString().notEmpty().withMessage('City is required'),
  body('state').isString().notEmpty().withMessage('State is required'),
  body('zipCode').isString().notEmpty().withMessage('Zip code is required'),
  body('cellPhone').isString().notEmpty().withMessage('Cell phone is required'),
  body('emergencyContact').isString().notEmpty().withMessage('Emergency contact is required'),
  body('emergencyContactPhone').isString().notEmpty().withMessage('Emergency contact phone is required'),
  body('subscriptionId').optional().isInt().withMessage('Subscription ID must be an integer'),
  handleValidationErrors
];

// Middleware for validating employee creation
export const validateEmployeeCreation = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isString().notEmpty().withMessage('Phone is required'),
  body('role').isString().notEmpty().withMessage('Role is required'),
  body('hireDate').optional().isISO8601().withMessage('Valid hire date is required'),
  body('salary').optional().isFloat({ gt: 0 }).withMessage('Salary must be a positive number'),
  body('payRate').optional().isFloat({ gt: 0 }).withMessage('Pay rate must be a positive number'),
  body('beltRank').optional().isString().withMessage('Belt rank must be a string'),
  handleValidationErrors
];

// Middleware for validating subscription creation
export const validateSubscriptionCreation = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ gt: 0 }).withMessage('Duration must be a positive integer'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('classesPerWeek').optional().isInt({ gt: 0 }).withMessage('Classes per week must be a positive integer'),
  body('isUnlimited').optional().isBoolean().withMessage('isUnlimited must be a boolean'),
  body('allowsFreeze').optional().isBoolean().withMessage('allowsFreeze must be a boolean'),
  body('freezeLimit').optional().isInt({ gt: 0 }).withMessage('Freeze limit must be a positive integer'),
  body('commitmentPeriod').optional().isInt({ gt: 0 }).withMessage('Commitment period must be a positive integer'),
  body('earlyTerminationFee').optional().isFloat({ gt: 0 }).withMessage('Early termination fee must be a positive number'),
  body('signupFee').optional().isFloat({ gt: 0 }).withMessage('Signup fee must be a positive number'),
  body('familyPlan').optional().isBoolean().withMessage('familyPlan must be a boolean'),
  body('maxMembers').optional().isInt({ gt: 0 }).withMessage('Max members must be a positive integer'),
  body('discountPercent').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount percentage must be between 0 and 100'),
  body('active').optional().isBoolean().withMessage('active must be a boolean'),
  body('accessPrivateClasses').optional().isBoolean().withMessage('accessPrivateClasses must be a boolean'),
  body('accessSpecialEvents').optional().isBoolean().withMessage('accessSpecialEvents must be a boolean'),
  handleValidationErrors
];

// Middleware for validating training session creation
export const validateTrainingSessionCreation = [
  body('name').isString().notEmpty().withMessage('Class name is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Start time must be in format HH:MM:SS'),
  body('endTime').matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('End time must be in format HH:MM:SS'),
  body('classType').isString().notEmpty().withMessage('Class type is required'),
  body('level').optional().isString().withMessage('Level must be a string'),
  body('employeeId').isInt().withMessage('Employee ID must be an integer'),
  body('clientId').isInt().withMessage('Client ID must be an integer'),
  body('attendance').optional().isBoolean().withMessage('Attendance must be a boolean'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  body('location').optional().isString().withMessage('Location must be a string'),
  body('maxCapacity').optional().isInt({ gt: 0 }).withMessage('Max capacity must be a positive integer'),
  handleValidationErrors
];

// Middleware for validating payment record creation
export const validatePaymentRecordCreation = [
  body('clientId').isInt().withMessage('Client ID must be an integer'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('status').isString().isIn(['completed', 'pending', 'failed', 'refunded']).withMessage('Status must be valid'),
  handleValidationErrors
];