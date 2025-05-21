import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import Client from '../models/Client';
import logger from '../utils/logger';

// Create a new subscription
export const createSubscription = async (req: Request, res: Response) => {
    logger.info('Creating new subscription plan', { 
        name: req.body.name,
        price: req.body.price,
        duration: req.body.duration
    });
    
    try {
        const subscription = await Subscription.create(req.body);
        logger.info('Subscription plan created successfully', { 
            subscriptionId: subscription.id,
            name: subscription.name,
            price: subscription.price
        });
        res.status(201).json(subscription);
    } catch (error: any) {
        if (error.name === 'SequelizeValidationError') {
            logger.warn('Subscription creation validation failed', {
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message })),
                request: req.body
            });
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
        }
        logger.error('Error creating subscription plan', {
            error: error.message,
            stack: error.stack,
            request: req.body
        });
        res.status(500).json({ message: 'Error creating subscription plan', error: error.message });
    }
};

// Get all subscription plans
export const getAllSubscriptions = async (req: Request, res: Response) => {
    logger.info('Fetching all subscription plans');
    
    try {
        const subscriptions = await Subscription.findAll({
            include: [{
                model: Client,
                as: 'clients',
                attributes: ['id', 'name'],
                limit: 5 // Only include a few clients as example
            }]
        });
        
        logger.info('Successfully retrieved all subscription plans', {
            count: subscriptions.length
        });
        
        res.status(200).json(subscriptions);
    } catch (error: any) {
        logger.error('Error retrieving subscription plans', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error retrieving subscription plans', error: error.message });
    }
};

// Get subscription plan by ID
export const getSubscriptionById = async (req: Request, res: Response) => {
    const subscriptionId = req.params.id;
    logger.info('Fetching subscription plan by ID', { subscriptionId });
    
    try {
        const subscription = await Subscription.findByPk(subscriptionId, {
            include: [{
                model: Client,
                as: 'clients',
                attributes: ['id', 'name', 'email']
            }]
        });
        
        if (subscription) {
            logger.info('Successfully retrieved subscription plan', { 
                subscriptionId,
                name: subscription.name
            });
            res.status(200).json(subscription);
        } else {
            logger.warn('Subscription plan not found', { subscriptionId });
            res.status(404).json({ message: 'Subscription plan not found' });
        }
    } catch (error: any) {
        logger.error('Error retrieving subscription plan', {
            subscriptionId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error retrieving subscription plan', error: error.message });
    }
};

// Update a subscription plan
export const updateSubscription = async (req: Request, res: Response) => {
    const subscriptionId = req.params.id;
    logger.info('Updating subscription plan', { 
        subscriptionId,
        fieldsToUpdate: Object.keys(req.body)
    });
    
    try {
        const [updated] = await Subscription.update(req.body, {
            where: { id: subscriptionId }
        });
        
        if (updated) {
            const updatedSubscription = await Subscription.findByPk(subscriptionId);
            logger.info('Subscription plan updated successfully', { 
                subscriptionId,
                name: updatedSubscription?.name,
                price: updatedSubscription?.price
            });
            res.status(200).json(updatedSubscription);
        } else {
            logger.warn('Subscription plan not found for update', { subscriptionId });
            res.status(404).json({ message: 'Subscription plan not found' });
        }
    } catch (error: any) {
        if (error.name === 'SequelizeValidationError') {
            logger.warn('Subscription update validation failed', {
                subscriptionId,
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message })),
                request: req.body
            });
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
        }
        logger.error('Error updating subscription plan', {
            subscriptionId,
            error: error.message,
            stack: error.stack,
            request: req.body
        });
        res.status(500).json({ message: 'Error updating subscription plan', error: error.message });
    }
};

// Delete a subscription plan
export const deleteSubscription = async (req: Request, res: Response) => {
    const subscriptionId = req.params.id;
    logger.info('Deleting subscription plan', { subscriptionId });
    
    try {
        const deleted = await Subscription.destroy({
            where: { id: subscriptionId }
        });
        
        if (deleted) {
            logger.info('Subscription plan deleted successfully', { subscriptionId });
            res.status(204).send();
        } else {
            logger.warn('Subscription plan not found for deletion', { subscriptionId });
            res.status(404).json({ message: 'Subscription plan not found' });
        }
    } catch (error: any) {
        logger.error('Error deleting subscription plan', {
            subscriptionId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error deleting subscription plan', error: error.message });
    }
};

// Search subscription plans
export const searchSubscriptions = async (req: Request, res: Response) => {
    logger.info('Searching subscription plans', { searchParams: req.query });
    
    try {
        const nameParam = typeof req.query.name === 'string' ? req.query.name : '';
        const minPriceParam = req.query.minPrice ? Number(req.query.minPrice) : undefined;
        const maxPriceParam = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
        
      
        let activeParam: boolean | undefined = undefined;
        if (req.query.active === 'true') {
            activeParam = true;
        } else if (req.query.active === 'false') {
            activeParam = false;
        }
        
        const whereClause: any = {};
        
        if (nameParam) {
            whereClause.name = { [Op.iLike]: `%${nameParam}%` };
        }
        
        if (minPriceParam !== undefined || maxPriceParam !== undefined) {
            whereClause.price = {};
            if (minPriceParam !== undefined) {
                whereClause.price[Op.gte] = minPriceParam;
            }
            if (maxPriceParam !== undefined) {
                whereClause.price[Op.lte] = maxPriceParam;
            }
        }
        
        if (activeParam !== undefined) {
            whereClause.active = activeParam;
        }
        
        const subscriptions = await Subscription.findAll({
            where: whereClause,
            include: [{
                model: Client,
                as: 'clients',
                attributes: ['id', 'name'],
                limit: 3
            }]
        });
        
        logger.info('Subscription plan search completed', { 
            criteria: {
                name: nameParam || undefined,
                minPrice: minPriceParam ?? undefined,
                maxPrice: maxPriceParam ?? undefined,
                active: activeParam
            },
            resultsCount: subscriptions.length
        });
        
        res.status(200).json(subscriptions);
    } catch (error: any) {
        logger.error('Error searching subscription plans', {
            searchParams: req.query,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error searching subscription plans', error: error.message });
    }
};

// Get clients by subscription
export const getClientsBySubscription = async (req: Request, res: Response) => {
    const subscriptionId = req.params.id;
    logger.info('Fetching clients by subscription ID', { subscriptionId });
    
    try {
        const subscription = await Subscription.findByPk(subscriptionId, {
            include: [{
                model: Client,
                as: 'clients'
            }]
        });
        
        if (subscription) {
            // Use type assertion to fix TypeScript error
            const clients = (subscription as any).clients ?? [];
            
            logger.info('Successfully retrieved clients for subscription', {
                subscriptionId,
                subscriptionName: subscription.name,
                clientCount: clients.length
            });
            
            res.status(200).json(clients);
        } else {
            logger.warn('Subscription plan not found', { subscriptionId });
            res.status(404).json({ message: 'Subscription plan not found' });
        }
    } catch (error: any) {
        logger.error('Error fetching clients by subscription', {
            subscriptionId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error fetching clients by subscription', error: error.message });
    }
};