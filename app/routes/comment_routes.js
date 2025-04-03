const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment_controller');

// POST /add-comment
router.post('/', commentController.addComment);

module.exports = router;