# Academy CMS

## Overview

The Academy CMS is a backend application designed to manage Brazilian Jiu-Jitsu training clients, employees, contracts, training progress, and logistical information. It provides a structured way to track clients, employees, training data, and logistics, ensuring efficient management of academy operations.

## Technical Stack

- **Backend**: Node.js with Express
- **Language**: TypeScript
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Environment Variables**: Managed through a `.env` file
- **Development Tools**: nodemon, ts-node
- **Architecture**: Monolithic structure with MVC (Model-View-Controller) separation

## Project Structure

``` bash

academy-cms
├── src
│   ├── index.ts
│   ├── app.ts
│   ├── config
│   │   └── database.ts
│   ├── models
│   │   ├── index.ts
│   │   ├── Client.ts
│   │   ├── Employee.ts
│   │   ├── Subscription.ts
│   │   ├── TrainingSession.ts
│   │   └── PaymentRecord.ts
│   ├── controllers
│   │   ├── index.ts
│   │   ├── clientController.ts
│   │   ├── employeeController.ts
│   │   ├── subscriptionController.ts
│   │   ├── trainingController.ts
│   │   └── paymentController.ts
│   ├── routes
│   │   ├── index.ts
│   │   ├── clientRoutes.ts
│   │   ├── employeeRoutes.ts
│   │   ├── subscriptionRoutes.ts
│   │   ├── trainingRoutes.ts
│   │   └── paymentRoutes.ts
│   ├── middleware
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── types
│   │   └── index.ts
│   └── utils
│       └── logger.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd academy-cms
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   - Create a `.env` file in the root directory and set the following variables:

     ``` bash

     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=academy_cms
     DB_USER=your_username
     DB_PASSWORD=your_password
     ```

4. **Run the Application**

   ```bash
   npm run dev
   ```

5. **Test the API**
   - Use Postman or curl to test the API endpoints.

## API Endpoints

- **/ping**: Health-check route to verify the server is running.
- **Client Management**: Registering clients, upgrading/downgrading subscriptions.
- **Employee Management**: Adding and managing employees.
- **Training Management**: Recording training attendance and progress.
- **Payment Processing**: Handling payments and billing history.

## Special Notes

- Focus on clean, modular, and scalable code.
- Ensure types are properly annotated throughout the codebase.
- Comment each major file and function for clarity.
- Prefer using async/await for database operations to maintain readable code.
