import { Request, Response } from 'express';
import { Op } from 'sequelize';
import PaymentRecord from '../models/PaymentRecord';
import Client from '../models/Client';
import logger from '../utils/logger';

// Create a new payment record
export const createPayment = async (req: Request, res: Response) => {
    logger.info('Creating new payment record', { 
        clientId: req.body.clientId,
        amount: req.body.amount,
        status: req.body.status
    });
    
    try {
        const paymentRecord = await PaymentRecord.create(req.body);
        logger.info('Payment record created successfully', { 
            paymentId: paymentRecord.id,
            clientId: paymentRecord.clientId,
            amount: paymentRecord.amount
        });
        res.status(201).json(paymentRecord);
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'SequelizeValidationError') {
            logger.warn('Payment record creation validation failed', {
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message })),
                request: req.body
            });
             res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            }); 
            return;
        }
        logger.error('Error creating payment record', {
            error: error.message,
            stack: error.stack,
            request: req.body
        });
        res.status(500).json({ message: 'Error creating payment record', error: error.message });
    }
};

// Get all payment records
export const getAllPayments = async (req: Request, res: Response) => {
    logger.info('Fetching all payment records');
    
    try {
        const payments = await PaymentRecord.findAll({
            include: [{
                model: Client,
                as: 'client',
                attributes: ['id', 'name', 'email']
            }]
        });
        
        logger.info('Successfully retrieved payment records', {
            count: payments.length
        });
        
        res.status(200).json(payments);
    } catch (error: any) {
        logger.error('Error fetching payment records', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error fetching payment records', error: error.message });
    }
};

// Get payments by client ID
export const getPaymentsByClientId = async (req: Request, res: Response) => {
    const clientId = req.params.clientId;
    logger.info('Fetching payment records by client ID', { clientId });
    
    try {
        const payments = await PaymentRecord.findAll({
            where: { clientId },
            include: [{
                model: Client,
                as: 'client',
                attributes: ['name', 'email']
            }]
        });
        
        logger.info('Successfully retrieved client payment records', {
            clientId,
            count: payments.length
        });
        
        res.status(200).json(payments);
    } catch (error: any) {
        logger.error('Error fetching client payment records', {
            clientId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error fetching client payment records', error: error.message });
    }
};

// Get a payment record by ID
export const getPaymentById = async (req: Request, res: Response) => {
    const paymentId = req.params.id;
    logger.info('Fetching payment record by ID', { paymentId });
    
    try {
        const payment = await PaymentRecord.findByPk(paymentId, {
            include: [{
                model: Client,
                as: 'client',
                attributes: ['id', 'name', 'email']
            }]
        });
        
        if (payment) {
            logger.info('Successfully retrieved payment record', { 
                paymentId,
                clientId: payment.clientId,
                amount: payment.amount
            });
            res.status(200).json(payment);
        } else {
            logger.warn('Payment record not found', { paymentId });
            res.status(404).json({ message: 'Payment record not found' });
        }
    } catch (error: any) {
        logger.error('Error fetching payment record', {
            paymentId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error fetching payment record', error: error.message });
    }
};

// Update a payment record
export const updatePayment = async (req: Request, res: Response) => {
    const paymentId = req.params.id;
    logger.info('Updating payment record', { 
        paymentId,
        fieldsToUpdate: Object.keys(req.body)
    });
    
    try {
        const [updated] = await PaymentRecord.update(req.body, {
            where: { id: paymentId }
        });
        
        if (updated) {
            const updatedPayment = await PaymentRecord.findByPk(paymentId, {
                include: [{
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name', 'email']
                }]
            });
            
            logger.info('Payment record updated successfully', { 
                paymentId,
                status: updatedPayment?.status,
                amount: updatedPayment?.amount
            });
            
            res.status(200).json(updatedPayment);
        } else {
            logger.warn('Payment record not found for update', { paymentId });
            res.status(404).json({ message: 'Payment record not found' });
        }
    } catch (error: any) {
        if (error.name === 'SequelizeValidationError') {
            logger.warn('Payment record update validation failed', {
                paymentId,
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message })),
                request: req.body
            });
             res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            }); 
            return;
        }
        logger.error('Error updating payment record', {
            paymentId,
            error: error.message,
            stack: error.stack,
            request: req.body
        });
        res.status(500).json({ message: 'Error updating payment record', error: error.message });
    }
};

// Delete a payment record
export const deletePayment = async (req: Request, res: Response) => {
    const paymentId = req.params.id;
    logger.info('Deleting payment record', { paymentId });
    
    try {
        const deleted = await PaymentRecord.destroy({
            where: { id: paymentId }
        });
        
        if (deleted) {
            logger.info('Payment record deleted successfully', { paymentId });
            res.status(204).send();
        } else {
            logger.warn('Payment record not found for deletion', { paymentId });
            res.status(404).json({ message: 'Payment record not found' });
        }
    } catch (error: any) {
        logger.error('Error deleting payment record', {
            paymentId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error deleting payment record', error: error.message });
    }
};

// Helper function to process search parameters
const processSearchParams = (query: any) => {
    return {
        clientId: query.clientId ? Number(query.clientId) : undefined,
        status: typeof query.status === 'string' ? query.status : '',
        minAmount: query.minAmount ? Number(query.minAmount) : undefined,
        maxAmount: query.maxAmount ? Number(query.maxAmount) : undefined,
        startDate: typeof query.startDate === 'string' ? new Date(query.startDate) : undefined,
        endDate: typeof query.endDate === 'string' ? new Date(query.endDate) : undefined,
    };
};

// Helper function to build where clause from parameters
const buildWhereClause = (params: any) => {
    const whereClause: any = {};
    
    if (params.clientId) {
        whereClause.clientId = params.clientId;
    }
    
    if (params.status) {
        whereClause.status = { [Op.iLike]: `%${params.status}%` };
    }
    
    // Handle amount range
    if (params.minAmount !== undefined || params.maxAmount !== undefined) {
        whereClause.amount = {};
        if (params.minAmount !== undefined) {
            whereClause.amount[Op.gte] = params.minAmount;
        }
        if (params.maxAmount !== undefined) {
            whereClause.amount[Op.lte] = params.maxAmount;
        }
    }
    
    // Handle date range
    if (params.startDate || params.endDate) {
        whereClause.date = {};
        if (params.startDate) {
            whereClause.date[Op.gte] = params.startDate;
        }
        if (params.endDate) {
            whereClause.date[Op.lte] = params.endDate;
        }
    }
    
    return whereClause;
};

// Search payment records - refactored for lower cognitive complexity
export const searchPayments = async (req: Request, res: Response) => {
    logger.info('Searching payment records', { searchParams: req.query });
    
    try {
        // Process query parameters
        const searchParams = processSearchParams(req.query);
        
        // Build where clause
        const whereClause = buildWhereClause(searchParams);
        
        // Execute search query
        const payments = await PaymentRecord.findAll({
            where: whereClause,
            include: [{
                model: Client,
                as: 'client',
                attributes: ['id', 'name', 'email']
            }],
            order: [['date', 'DESC']]
        });
        
        logger.info('Payment record search completed', { 
            criteria: {
                clientId: searchParams.clientId ?? undefined,
                status: searchParams.status ?? undefined,
                minAmount: searchParams.minAmount ?? undefined,
                maxAmount: searchParams.maxAmount ?? undefined,
                startDate: searchParams.startDate || undefined,
                endDate: searchParams.endDate || undefined
            },
            resultsCount: payments.length
        });
        
        res.status(200).json(payments);
    } catch (error: any) {
        logger.error('Error searching payment records', {
            searchParams: req.query,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error searching payment records', error: error.message });
    }
};