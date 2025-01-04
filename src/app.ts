import express from 'express';
import bodyParser from 'body-parser';
import { authRouter, commentsRouter, postsRouter } from './routers';

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/auth', authRouter);
