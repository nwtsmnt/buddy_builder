const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile_controller');

// GET route for viewing the profile
router.get('/profile', profileController.getProfile);

// GET route for the edit profile page
router.get('/edit-profile', async (req, res) => {
  try {
    const userId = req.session.userId;
    const result = await require('../models/db').query('SELECT * FROM Users WHERE id = ?', [userId]);
    if (!result.length) {
      return res.redirect('/login');
    }
    res.render('edit_profile', { user: result[0] });
  } catch (error) {
    console.error('Error loading edit profile:', error);
    res.redirect('/profile');
  }
});

// Route for updating the profile
router.post('/edit-profile', profileController.updateProfile);

module.exports = router;
