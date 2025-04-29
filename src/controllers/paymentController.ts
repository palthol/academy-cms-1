import { Request, Response } from 'express';
import PaymentRecord from '../models/PaymentRecord';

// Create a new payment record
export const createPayment = async (req: Request, res: Response) => {
    try {
        const { clientId, amount, date, status } = req.body;
        const paymentRecord = await PaymentRecord.create({ clientId, amount, date, status });
        res.status(201).json(paymentRecord);
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment record', error });
    }
};

// Get all payment records
export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const payments = await PaymentRecord.findAll();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment records', error });
    }
};

// Get a payment record by ID
export const getPaymentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payment = await PaymentRecord.findByPk(id);
        if (payment) {
            res.status(200).json(payment);
        } else {
            res.status(404).json({ message: 'Payment record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment record', error });
    }
};

// Update a payment record
export const updatePayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { clientId, amount, date, status } = req.body;
        const payment = await PaymentRecord.findByPk(id);
        if (payment) {
            await payment.update({ clientId, amount, date, status });
            res.status(200).json(payment);
        } else {
            res.status(404).json({ message: 'Payment record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment record', error });
    }
};

// Delete a payment record
export const deletePayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payment = await PaymentRecord.findByPk(id);
        if (payment) {
            await payment.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Payment record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment record', error });
    }
};