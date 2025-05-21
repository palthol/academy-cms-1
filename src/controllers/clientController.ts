import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Client from '../models/Client';
import Subscription from '../models/Subscription';
import logger from '../utils/logger';

// Create a new client
export const createClient = async (req: Request, res: Response) => {
    logger.info('Creating new client', { 
        email: req.body.email,
        name: req.body.name
    });
    
    try {
        const client = await Client.create(req.body);
        logger.info('Client created successfully', { 
            clientId: client.id,
            email: client.email
        });
        res.status(201).json(client);
    } catch (error: any) {
        // Enhanced error handling with logging
        if (error.name === 'SequelizeValidationError') {
            logger.warn('Client creation validation failed', {
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message })),
                request: req.body
            });
             res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
            return;
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            logger.warn('Client creation failed - Email already in use', {
                email: req.body.email
            });
             res.status(409).json({ message: 'Email already in use' });
        return;
        }
        logger.error('Error creating client', {
            error: error.message,
            stack: error.stack,
            request: req.body
        });
        res.status(500).json({ message: 'Error creating client', error: error.message });
    }
};

// Get all clients
export const getClients = async (req: Request, res: Response) => {
    logger.info('Fetching all clients');
    
    try {
        const clients = await Client.findAll({
            include: [{
                model: Subscription,
                as: 'subscription',
                attributes: ['name', 'price', 'duration']
            }]
        });
        
        logger.info('Successfully retrieved all clients', {
            count: clients.length
        });
        
        res.status(200).json(clients);
    } catch (error: any) {
        logger.error('Error retrieving clients', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error retrieving clients', error: error.message });
    }
};

// Get a client by ID
export const getClientById = async (req: Request, res: Response) => {
    const clientId = req.params.id;
    logger.info('Fetching client by ID', { clientId });
    
    try {
        const client = await Client.findByPk(clientId, {
            include: [{
                model: Subscription,
                as: 'subscription'
            }]
        });
        
        if (client) {
            logger.info('Successfully retrieved client', { 
                clientId,
                name: client.name 
            });
            res.status(200).json(client);
        } else {
            logger.warn('Client not found', { clientId });
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error: any) {
        logger.error('Error retrieving client by ID', {
            clientId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error retrieving client', error: error.message });
    }
};

// Update a client
export const updateClient = async (req: Request, res: Response) => {
    const clientId = req.params.id;
    logger.info('Updating client', { 
        clientId,
        fieldsToUpdate: Object.keys(req.body)
    });
    
    try {
        const [updated] = await Client.update(req.body, {
            where: { id: clientId }
        });
        
        if (updated) {
            const updatedClient = await Client.findByPk(clientId, {
                include: [{
                    model: Subscription,
                    as: 'subscription'
                }]
            });
            logger.info('Client updated successfully', { 
                clientId,
                name: updatedClient?.name 
            });
            res.status(200).json(updatedClient);
        } else {
            logger.warn('Client not found for update', { clientId });
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error: any) {
        // Enhanced error handling with logging
        if (error.name === 'SequelizeValidationError') {
            logger.warn('Client update validation failed', {
                clientId,
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message })),
                request: req.body
            });
             res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
            return;
        }
        logger.error('Error updating client', {
            clientId,
            error: error.message,
            stack: error.stack,
            request: req.body
        });
        res.status(500).json({ message: 'Error updating client', error: error.message });
    }
};

// Delete a client
export const deleteClient = async (req: Request, res: Response) => {
    const clientId = req.params.id;
    logger.info('Deleting client', { clientId });
    
    try {
        const deleted = await Client.destroy({
            where: { id: clientId }
        });
        
        if (deleted) {
            logger.info('Client deleted successfully', { clientId });
            res.status(204).send();
        } else {
            logger.warn('Client not found for deletion', { clientId });
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error: any) {
        logger.error('Error deleting client', {
            clientId,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error deleting client', error: error.message });
    }
};

// Search clients
export const searchClients = async (req: Request, res: Response) => {
    logger.info('Searching clients', { 
        searchParams: req.query
    });
    
    try {
        // Type-safe query parameter handling
        const nameParam = typeof req.query.name === 'string' ? req.query.name : '';
        const emailParam = typeof req.query.email === 'string' ? req.query.email : '';
        const cityParam = typeof req.query.city === 'string' ? req.query.city : '';
        const stateParam = typeof req.query.state === 'string' ? req.query.state : '';
        
        const whereClause: any = {};
        
        if (nameParam) {
            whereClause.name = { [Op.iLike]: `%${nameParam}%` };
        }
        
        if (emailParam) {
            whereClause.email = { [Op.iLike]: `%${emailParam}%` };
        }
        
        if (cityParam) {
            whereClause.city = { [Op.iLike]: `%${cityParam}%` };
        }
        
        if (stateParam) {
            whereClause.state = { [Op.iLike]: `%${stateParam}%` };
        }
        
        const clients = await Client.findAll({
            where: whereClause,
            include: [{
                model: Subscription,
                as: 'subscription'
            }]
        });
        
        logger.info('Client search completed', { 
            criteria: {
                name: nameParam || undefined,
                email: emailParam || undefined,
                city: cityParam || undefined,
                state: stateParam || undefined
            },
            resultsCount: clients.length
        });
        
        res.status(200).json(clients);
    } catch (error: any) {
        logger.error('Error searching clients', {
            searchParams: req.query,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: 'Error searching clients', error: error.message });
    }
};