import express from 'express';
import { json } from 'body-parser';
import { connectToDatabase } from './config/database';
import appRoutes from './routes/index';
import errorHandler from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());
app.use(appRoutes);
app.use(errorHandler);

// Connect to the database
connectToDatabase();

// Health-check route
app.get('/ping', (req, res) => {
  res.status(200).send('Pong');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});