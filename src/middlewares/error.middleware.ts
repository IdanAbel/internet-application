import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const errorMiddleware: ErrorRequestHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('An error occurred!', error);
    res.status(500).json({ message: error.message });
};
