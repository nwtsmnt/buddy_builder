// routes/comment_routes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment_controller');

// POST /comments/add
router.post('/add', commentController.addComment);

module.exports = router;
