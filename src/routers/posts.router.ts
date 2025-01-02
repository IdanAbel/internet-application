import { Router } from 'express';
import { authMiddleware } from '../controllers/auth_controller';
import postsController from '../controllers/posts_controller';

export const postsRouter = Router();

postsRouter.get('/', postsController.getAll.bind(postsController));
postsRouter.get('/:id', postsController.getById.bind(postsController));
postsRouter.post('/', authMiddleware, postsController.create.bind(postsController));
postsRouter.delete('/:id', authMiddleware, postsController.deleteItem.bind(postsController));
