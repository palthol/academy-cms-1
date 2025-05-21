import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorLogger = (error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${error.name}: ${error.message}`, {
    method: req.method,
    url: req.url,
    stack: error.stack,
    body: req.body
  });
  
  next(error);
};