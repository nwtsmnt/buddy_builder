const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');

// Route to handle adding comments
router.post('/add-comment', postController.addComment);

module.exports = router;