const express = require('express');
const router = express.Router();
const editProfileController = require('../controllers/edit_profile_controller'); // Import the controller

// GET /profile/edit
router.get('/edit-profile', editProfileController.getEditProfile);

// POST /profile/edit
router.post('/edit-profile', editProfileController.updateProfile);

module.exports = router;