import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include user
export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
