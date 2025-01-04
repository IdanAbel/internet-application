import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { authRouter, commentsRouter, postsRouter } from './routers';

export const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/auth', authRouter);
