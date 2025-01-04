import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type Payload = {
    _id: string;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(400).send('Token was not provided');
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET!, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }
        req.params.userId = (payload as Payload)._id;
        next();
    });
};
