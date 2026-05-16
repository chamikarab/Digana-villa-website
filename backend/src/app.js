import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { corsOrigins } from './config/security.js';

const app = express();

if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: '16kb' }));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

app.use(errorHandler);

export default app;
