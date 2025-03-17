const express = require("express");
const router = express.Router();
const { renderNewsfeed } = require("../controllers/post_controller");

router.get("/newsfeed", renderNewsfeed);

module.exports = router;