const express = require('express');
const commentsController = require('../../controllers/comments/comments-controller');

const commentsRouter = express.Router();

commentsRouter.get('/', commentsController.getAllComments);

commentsRouter.get('/:comment_id', commentsController.getCommentById);

commentsRouter.post('/', commentsController.createComment);

commentsRouter.put('/:comment_id', commentsController.updateComment);

module.exports = commentsRouter;
