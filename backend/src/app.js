import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
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
app.use(cookieParser());
app.use(express.json({ limit: '32kb' }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

app.use(errorHandler);

export default app;
