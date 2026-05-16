import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminEmail as ADMIN_EMAIL, adminPasswordHash as ADMIN_PASSWORD_HASH, jwtSecret as JWT_SECRET } from '../config/security.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const emailNormalized = String(email).trim().toLowerCase();
    if (emailNormalized !== ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const passwordMatches = await bcrypt.compare(String(password), ADMIN_PASSWORD_HASH);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ email: ADMIN_EMAIL, role: 'admin' }, JWT_SECRET, {
      expiresIn: '8h',
    });

    return res.json({
      success: true,
      data: {
        user: {
          email: ADMIN_EMAIL,
          role: 'admin',
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      data: {
        user: {
          email: req.user.email,
          role: req.user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};
