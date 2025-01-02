import { Comment, CommentModel } from '../models/comment.model';
import { BaseController } from './base.controller';

export const commentsController = new BaseController<Comment>(CommentModel);
