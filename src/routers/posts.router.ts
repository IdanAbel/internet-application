import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { postController } from '../controllers/posts.controller';

export const postsRouter = Router();

postsRouter.get('/', postController.getAll.bind(postController));
postsRouter.get('/:id', postController.getById.bind(postController));
postsRouter.post('/', authMiddleware, postController.create.bind(postController));
postsRouter.delete('/:id', authMiddleware, postController.deleteItem.bind(postController));
