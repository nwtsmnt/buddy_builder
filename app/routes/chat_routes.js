const express = require('express');
const router = express.Router();

// Route to render chat.pug
router.get("/", (req, res) => {
    res.render("chat");
});

module.exports = router;

