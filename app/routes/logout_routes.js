const express = require("express");
const router = express.Router();

// Route for rendering the About Us page
router.get("/logout", (req, res) => {
  res.redirect("/");
});

module.exports = router;
