const CommentsModel = require('../../models/comments_model');

const getAllComments = async (req, res) => {
    try {
        const comments = await CommentsModel.find();
        res.send(comments);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const getCommentById = async (req, res) => {
    const commentId = req.params.comment_id;
    try {
        const comment = await CommentsModel.findById(commentId);
        comment ? res.send(comment) : res.status(404).send('Comment not found');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const createComment = async (req, res) => {
    const commentBody = req.body;
    try {
        const comment = await CommentsModel.create(commentBody);
        res.status(201).send(comment);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = { getAllComments, getCommentById, createComment };
