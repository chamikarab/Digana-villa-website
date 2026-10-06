import express from 'express';
import rateLimit from 'express-rate-limit';
import { createPublicBooking, createPublicReview, getPublicVilla } from '../controllers/dataController.js';

const router = express.Router();

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { success: false, error: 'Too many requests. Try again later.' },
});

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many booking attempts. Try again later.' },
});

router.use(publicLimiter);

router.get('/villa', getPublicVilla);
router.post('/bookings', bookingLimiter, createPublicBooking);
router.post('/reviews', bookingLimiter, createPublicReview);

export default router;
