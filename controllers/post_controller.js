const PostModel = require("../models/posts_model");

const getPostById = async (req, res) => {
  const postId = req.params.post_id;

  try {
    const post = await PostModel.findById(postId);
    if (post) {
      res.send(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getPost = async (req, res) => {
  const filter = req.query.sender_id;
  try {
    if (filter) {
      const posts = await PostModel.find({ sender_id: filter });
      res.send(posts);
    } else {
      const posts = await PostModel.find();
      res.send(posts);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const putPostById = async (req, res) => {
  const postId = req.params.post_id;
  const postBody = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post) {
      const post = await PostModel.findByIdAndUpdate(postId, postBody, {
        new: true, 
        runValidators: true, 
      });
      
      res.status(201).send(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getPostById,
  getPost,
  putPostById,
};
