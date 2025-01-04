import { Request, Response } from 'express';
import { UserDocument, UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const register = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password, salt);
        const user: UserDocument = await UserModel.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

type Tokens = {
    accessToken: string;
    refreshToken: string;
};

const generateToken = (userId: Types.ObjectId): Tokens => {
    const random = Math.random().toString();
    const accessToken = jwt.sign(
        {
            _id: userId,
            random: random,
        },
        process.env.TOKEN_SECRET!,
        { expiresIn: process.env.TOKEN_EXPIRES },
    );

    const refreshToken = jwt.sign(
        {
            _id: userId,
            random: random,
        },
        process.env.TOKEN_SECRET!,
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

        await updateRefreshTokenAndRespond(user, res);
    } catch (err) {
        res.status(400).send(err);
        return;
    }
};

const verifyRefreshToken = (refreshToken: string | undefined): Promise<UserDocument> => {
    return new Promise<UserDocument>((resolve, reject) => {
        if (!refreshToken) {
            reject('fail');
            return;
        }

        jwt.verify(refreshToken, process.env.TOKEN_SECRET!, async (err: any, payload: any) => {
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

                user.refreshToken = user.refreshToken!.filter((token) => token !== refreshToken);

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
        const user: UserDocument = await verifyRefreshToken(req.body.refreshToken);
        await updateRefreshTokenAndRespond(user, res);
    } catch (err) {
        res.status(400).send('fail');
    }
};

const updateRefreshTokenAndRespond = async (user: UserDocument, res: Response) => {
    const tokens: Tokens = generateToken(user._id);

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
};

export default {
    register,
    login,
    refresh,
    logout,
};
