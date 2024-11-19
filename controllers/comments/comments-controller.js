const CommentsModel = require('../../models/comments_model');

const getAllComments = async (req, res) => {
    try {
        const comments = await CommentsModel.find();
        res.send(comments);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = { getAllComments };
