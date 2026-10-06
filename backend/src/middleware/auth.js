import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/security.js';
import { getTokenFromRequest } from '../utils/authCookie.js';

export const protect = (req, res, next) => {
  const token = getTokenFromRequest(req);

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
