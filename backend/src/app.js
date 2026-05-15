import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// auth routes
app.use('/api/auth', authRoutes);

// test route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// shared error handler
app.use(errorHandler);

export default app;