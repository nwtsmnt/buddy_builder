const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile_controller");

// Route to render profile page
router.get("/:username", profileController.getProfile);

// Route to update profile info (e.g., bio, profile picture)
router.post("/:username/update", profileController.updateProfile);

module.exports = router;
