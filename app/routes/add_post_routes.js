const express = require("express");
const router = express.Router();
const postController = require("../controllers/post_controller");

// GET route to render the add post page
router.get("/", postController.renderAddPost);

// POST route to handle form submission
router.post("/", postController.addPost);

module.exports = router;