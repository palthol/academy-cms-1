import express from 'express';
import { json } from 'body-parser';
import connectToDatabase, { closeConnection, testConnection } from './config/database';
import appRoutes from './routes/index';
import errorHandler from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;
let server: any;

// Middleware
app.use(json());
app.use(appRoutes);
app.use(errorHandler);


// database health check endpoint
app.get('/db-health', async (req, res) => {
  const isConnected = await testConnection();
  if (isConnected) {
    res.status(200).json({ status: 'Database connection is healthy' });
  } else {
    res.status(500).json({ status: 'Database connection failed' });
  }
});

// Graceful shutdown function
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      
      closeConnection().then(() => {
        console.log('Process terminated');
        process.exit(0);
      }).catch(err => {
        console.error('Error during shutdown:', err);
        process.exit(1);
      });
    });
  } else {
    process.exit(0);
  }
};

// termination signal handling
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Connect to the database, then start the server
connectToDatabase()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });