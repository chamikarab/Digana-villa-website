import express from 'express';
import rateLimit from 'express-rate-limit';
import { getMe, login, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { isValidEmail, isValidPassword } from '../utils/validators.js';
import { isProduction } from '../config/security.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 20 : 120,
  message: { success: false, error: 'Too many login attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginValidation = {
  email: [
    (value) => (value ? true : 'Email is required.'),
    (value) => (isValidEmail(value) ? true : 'Please enter a valid email address.'),
  ],
  password: [
    (value) => (value ? true : 'Password is required.'),
    (value) => (isValidPassword(value) ? true : 'Password must be at least 8 characters long.'),
  ],
};

router.post('/login', loginLimiter, validateRequest(loginValidation), login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
