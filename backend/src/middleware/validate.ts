import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { STATUS_CODE } from '../constants/StatusCode';

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                res.status(STATUS_CODE.BAD_REQUEST).json({
                    message: "Validation Error",
                    errors: error.issues.map((e) => ({ path: e.path.join('.'), message: e.message }))
                });
            } else {
                next(error);
            }
        }
    };
};
