const express = require("express");
const router = express.Router();
const postController = require("../controllers/post_controller");

router.get("/", postController.getPost)

router.get("/:post_id", postController.getPostById)

module.exports = router;