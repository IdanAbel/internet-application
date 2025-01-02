import { NextFunction, Request, Response } from 'express';
import { UserDocument, UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await UserModel.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

type tTokens = {
    accessToken: string;
    refreshToken: string;
};

const generateToken = (userId: string): tTokens | null => {
    if (!process.env.TOKEN_SECRET) {
        return null;
    }
    // generate token
    const random = Math.random().toString();
    const accessToken = jwt.sign(
        {
            _id: userId,
            random: random,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES },
    );

    const refreshToken = jwt.sign(
        {
            _id: userId,
            random: random,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES },
    );
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};
const login = async (req: Request, res: Response) => {
    try {
        const user: UserDocument | null = await UserModel.findOne({ username: req.body.username });

        if (!user) {
            res.status(400).send('wrong username or password');
            return;
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            res.status(400).send('wrong username or password');
            return;
        }

        if (!process.env.TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        // generate token
        const tokens = generateToken(user._id);

        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id,
        });
        return;
    } catch (err) {
        res.status(400).send(err);
        return;
    }
};

const verifyRefreshToken = (refreshToken: string | undefined) => {
    return new Promise<UserDocument>((resolve, reject) => {
        //get refresh token from body
        if (!refreshToken) {
            reject('fail');
            return;
        }
        //verify token
        if (!process.env.TOKEN_SECRET) {
            reject('fail');
            return;
        }
        jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
            if (err) {
                reject('fail');
                return;
            }
            //get the user id fromn token
            const userId = payload._id;
            try {
                //get the user form the db
                const user: UserDocument | null = await UserModel.findById(userId);

                if (!user) {
                    reject('fail');
                    return;
                }

                if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
                    user.refreshToken = [];
                    await user.save();
                    reject('fail');
                    return;
                }

                const tokens = user.refreshToken!.filter((token) => token !== refreshToken);
                user.refreshToken = tokens;

                resolve(user);
            } catch (err) {
                reject('fail');
                return;
            }
        });
    });
};

const logout = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        await user.save();
        res.status(200).send('success');
    } catch (err) {
        res.status(400).send('fail');
    }
};

const refresh = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send('fail');
            return;
        }
        const tokens = generateToken(user._id);

        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id,
        });
        //send new token
    } catch (err) {
        res.status(400).send('fail');
    }
};

type Payload = {
    _id: string;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];
    console.log('Checking token', { token });

    if (!token) {
        res.status(401).send('Token was not provided');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        console.log('Verifying token');
        if (err) {
            console.log('Token is invalid');
            res.status(401).send('Access Denied');
            return;
        }
        req.params.userId = (payload as Payload)._id;
        next();
    });
};

export default {
    register,
    login,
    refresh,
    logout,
};
