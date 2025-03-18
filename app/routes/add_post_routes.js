const express = require('express');

const router = express.Router();

// Route to render add_post.pug
router.get("/", (req, res) => {
    res.render("add_post");
});

module.exports = router;