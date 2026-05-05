import { Request, Response, NextFunction } from 'express';
import { STATUS_CODE } from '../constants/StatusCode';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = res.statusCode === STATUS_CODE.SUCCESS ? STATUS_CODE.INTERNAL_SERVER_ERROR : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(STATUS_CODE.NOT_FOUND);
    next(error);
};
