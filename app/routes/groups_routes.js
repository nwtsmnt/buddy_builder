const express = require("express");
const router = express.Router();

// Route for the Groups page
router.get("/groups", (req, res) => {
    res.render("groups");
});

module.exports = router;