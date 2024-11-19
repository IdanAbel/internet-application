const express = require('express');
const commentsController = require('../../controllers/comments/comments-controller');

const commentsRouter = express.Router();

commentsRouter.get('/', commentsController.getAllComments);

module.exports = commentsRouter;
