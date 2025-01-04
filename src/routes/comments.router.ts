import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { commentsController } from '../controllers/comments/comments.controller';

export const commentsRouter = Router();

commentsRouter.get('/', commentsController.getAll.bind(commentsController));
commentsRouter.get('/:id', commentsController.getById.bind(commentsController));
commentsRouter.post('/', authMiddleware, commentsController.create.bind(commentsController));
commentsRouter.delete('/:id', authMiddleware, commentsController.deleteItem.bind(commentsController));
