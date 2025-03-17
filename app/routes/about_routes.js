const express = require("express");
const router = express.Router();

// Route for rendering the About Us page
router.get("/about-us", (req, res) => {
  res.render("about-us");
});

module.exports = router;
