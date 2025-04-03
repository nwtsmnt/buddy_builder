const express = require("express");
const router = express.Router();

// Route for the Groups page
router.get("/", (req, res) => {
    res.render("groups");
});

module.exports = router;