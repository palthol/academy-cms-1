import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Middleware for validating client registration
export const validateClientRegistration = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subscriptionId').isInt().withMessage('Subscription ID must be an integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware for validating employee creation
export const validateEmployeeCreation = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('role').isString().notEmpty().withMessage('Role is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware for validating subscription creation
export const validateSubscriptionCreation = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ gt: 0 }).withMessage('Duration must be a positive integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware for validating training session creation
export const validateTrainingSessionCreation = [
  body('clientId').isInt().withMessage('Client ID must be an integer'),
  body('duration').isInt({ gt: 0 }).withMessage('Duration must be a positive integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware for validating payment record creation
export const validatePaymentRecordCreation = [
  body('clientId').isInt().withMessage('Client ID must be an integer'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];