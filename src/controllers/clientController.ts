import { Request, Response } from 'express';
import Client from '../models/Client';

// Create a new client
export const createClient = async (req: Request, res: Response) => {
    try {
        const client = await Client.create(req.body);
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error creating client', error });
    }
};

// Get all clients
export const getClients = async (req: Request, res: Response) => {
    try {
        const clients = await Client.findAll();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving clients', error });
    }
};

// Get a client by ID
export const getClientById = async (req: Request, res: Response) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving client', error });
    }
};

// Update a client
export const updateClient = async (req: Request, res: Response) => {
    try {
        const [updated] = await Client.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedClient = await Client.findByPk(req.params.id);
            res.status(200).json(updatedClient);
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating client', error });
    }
};

// Delete a client
export const deleteClient = async (req: Request, res: Response) => {
    try {
        const deleted = await Client.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client', error });
    }
};