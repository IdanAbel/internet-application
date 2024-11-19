const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    sender_id: {
        type: String,
        required: true,
    },
    post_id: {
        type: String,
        required: true,
    },
});

const commentModel = mongoose.model('Comments', commentSchema);

module.exports = commentModel;
