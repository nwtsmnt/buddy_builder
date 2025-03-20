const express = require('express');
const router = express.Router();

// Route for the edit-profile page
router.get('/edit-profile', (req, res) => {
    res.render('edit_profile', { title: 'Edit Profile' });
});

module.exports = router;