import { Request, Response } from 'express';
import Subscription from '../models/Subscription';

// Create a new subscription
export const createSubscription = async (req: Request, res: Response) => {
    try {
        const { name, price, duration } = req.body;
        const subscription = await Subscription.create({ name, price, duration });
        res.status(201).json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Error creating subscription', error });
    }
};

// Get all subscriptions
export const getSubscriptions = async (req: Request, res: Response) => {
    try {
        const subscriptions = await Subscription.findAll();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error });
    }
};

// Get a subscription by ID
export const getSubscriptionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findByPk(id);
        if (subscription) {
            res.status(200).json(subscription);
        } else {
            res.status(404).json({ message: 'Subscription not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscription', error });
    }
};

// Update a subscription
export const updateSubscription = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, price, duration } = req.body;
        const subscription = await Subscription.findByPk(id);
        if (subscription) {
            await subscription.update({ name, price, duration });
            res.status(200).json(subscription);
        } else {
            res.status(404).json({ message: 'Subscription not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating subscription', error });
    }
};

// Delete a subscription
export const deleteSubscription = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findByPk(id);
        if (subscription) {
            await subscription.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Subscription not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscription', error });
    }
};