import { Comment, CommentModel } from '../models/comment.model';
import { BaseController } from './base.controller';
import { Request, Response } from 'express';

class CommentsController extends BaseController<Comment> {
    constructor() {
        super(CommentModel);
    }

    async create(req: Request, res: Response) {
        const userId = req.params.userId;
        console.log('userId', userId);
        req.body = { ...req.body, owner: userId };
        await super.create(req, res);
    }
}

export const commentsController = new CommentsController();
