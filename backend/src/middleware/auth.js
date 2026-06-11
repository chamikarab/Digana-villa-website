import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/security.js';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Not authorized.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ success: false, error: 'Not authorized.' });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: 'Session expired. Please log in again.',
    });
  }
};
