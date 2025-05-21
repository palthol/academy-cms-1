import { Request, Response } from 'express';
import Client from '../models/Client';
import Subscription from '../models/Subscription';
import { Op } from 'sequelize';



// Create a new client
export const createClient = async (req: Request, res: Response) => {
    try {
        // Already using req.body directly which includes all fields
        const client = await Client.create(req.body);
        res.status(201).json(client);
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: 'Error creating client', error: error.message });
    }
};

// Get all clients
export const getClients = async (req: Request, res: Response) => {
    try {
        // Include subscription information when retrieving clients
        const clients = await Client.findAll({
            include: [{
                model: Subscription,
                as: 'subscription',
                attributes: ['name', 'price', 'duration'] // Limit subscription info
            }]
        });
        res.status(200).json(clients);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving clients', error: error.message });
    }
};

// Get a client by ID
export const getClientById = async (req: Request, res: Response) => {
    try {
        const client = await Client.findByPk(req.params.id, {
            include: [{
                model: Subscription,
                as: 'subscription'
            }]
        });
        
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving client', error: error.message });
    }
};

// Update a client
export const updateClient = async (req: Request, res: Response) => {
    try {
        const [updated] = await Client.update(req.body, {
            where: { id: req.params.id }
        });
        
        if (updated) {
            const updatedClient = await Client.findByPk(req.params.id, {
                include: [{
                    model: Subscription,
                    as: 'subscription'
                }]
            });
            res.status(200).json(updatedClient);
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error: any) {
        // Enhanced error handling
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors.map((e: any) => ({ field: e.path, message: e.message }))
            });
        }
        res.status(500).json({ message: 'Error updating client', error: error.message });
    }
};

// Delete a client
export const deleteClient = async (req: Request, res: Response) => {
    // No changes needed - deletion works the same
    try {
        const deleted = await Client.destroy({
            where: { id: req.params.id }
        });
        
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting client', error: error.message });
    }
};

// New method: Search clients with improved type handling
export const searchClients = async (req: Request, res: Response) => {
    try {
        // Safely extract and type query parameters
        const nameParam = typeof req.query.name === 'string' ? req.query.name : '';
        const emailParam = typeof req.query.email === 'string' ? req.query.email : '';
        
        const whereClause: any = {};
        
        // Use explicit braces for clarity
        if (nameParam) {
            whereClause.name = { [Op.iLike]: `%${nameParam}%` };
        }
        
        if (emailParam) {
            whereClause.email = { [Op.iLike]: `%${emailParam}%` };
        }
        
        // Query will always run (not conditionally)
        const clients = await Client.findAll({
            where: whereClause,
            include: [{
                model: Subscription,
                as: 'subscription'
            }]
        });
        
        res.status(200).json(clients);
    } catch (error: any) {
        res.status(500).json({ message: 'Error searching clients', error: error.message });
    }
};