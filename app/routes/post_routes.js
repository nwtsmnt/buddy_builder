const express = require("express");
const router = express.Router();
const { renderNewsfeed, addPost, renderProfile } = require("../controllers/post_controller");

router.get("/newsfeed", renderNewsfeed);
router.post('/add_post', addPost);
router.get('/profile', renderProfile);

module.exports = router;