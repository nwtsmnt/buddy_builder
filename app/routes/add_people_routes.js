// Same content as add-people.js above
const express = require('express');
const router = express.Router();

// Simple route to render the page
router.get('/', (req, res) => {
  try {
    res.render('add-people', {
      title: 'Add People',
      user: req.session.user || { name: 'User' }
    });
  } catch (error) {
    console.error('Error in add-people route:', error);
    res.status(500).send('An error occurred while loading the add people page');
  }
});

module.exports = router;
