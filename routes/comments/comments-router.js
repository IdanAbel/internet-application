const express = require('express');
const commentsController = require('../../controllers/comments/comments-controller');

const commentsRouter = express.Router();

commentsRouter.get('/', commentsController.getAllComments);

commentsRouter.post('/', commentsController.createComment);

module.exports = commentsRouter;
