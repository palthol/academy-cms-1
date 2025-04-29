export interface Client {
    id: number;
    name: string;
    email: string;
    subscriptionId: number;
}

export interface Employee {
    id: number;
    name: string;
    role: string;
    schedule: string;
}

export interface Subscription {
    id: number;
    name: string;
    price: number;
    duration: string; // e.g., 'monthly', 'yearly'
}

export interface TrainingSession {
    id: number;
    clientId: number;
    duration: number; // in minutes
    progress: string; // e.g., 'beginner', 'intermediate', 'advanced'
    attendance: boolean;
}

export interface PaymentRecord {
    id: number;
    clientId: number;
    amount: number;
    date: Date;
    status: string; // e.g., 'completed', 'pending', 'failed'
}