import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
}

// ✅ Extend Express Request object to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * 🔒 authenticate — for routes that require login
 * Verifies JWT and attaches user info to request.
 * Returns 401 if token is missing or invalid.
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
}

/**
 * 👥 authenticateOptional — for routes that allow guests
 * If token exists and is valid, attaches user info.
 * If not, continues as guest (no response is sent).
 */
export function authenticateOptional(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
    }
  } catch (error) {
    // Invalid or missing token → continue as guest
  }

  // ✅ Always continue — no multiple next() calls
  next();
}

/**
 * 🔑 generateToken — create a signed JWT
 */
export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '30d' });
}
