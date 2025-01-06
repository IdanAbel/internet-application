import { Post, PostModel } from '../../models/post.model';
import { Request, Response } from 'express';
import { BaseController } from '../base.controller';

class PostsController extends BaseController<Post> {
    constructor() {
        super(PostModel);
    }

    async create(req: Request, res: Response) {
        const userId = req.params.userId;
        req.body = { ...req.body, owner: userId };
        await super.create(req, res);
    }
}

export const postController = new PostsController();
