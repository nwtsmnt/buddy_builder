const express = require("express");
const router = express.Router();

// Route for the intro page
router.get("/", (req, res) => {
  res.render("intro");
});

module.exports = router;
