// routes/profile_routes.js
const express = require('express');
const router = express.Router();
const db = require('../models/db'); // your db.js file

router.get('/', async (req, res) => {
  try {
    // Hardcode userId = 1 for testing. Or get from session, e.g. req.session.userId
    const userId = 1;
    
    // Because db.query is async, we 'await' it
    const results = await db.query('SELECT * FROM Users WHERE id = ?', [userId]);

    if (results.length > 0) {
      const user = results[0];
      // Pass user to Pug template
      res.render('profile', { user });
    } else {
      res.send('No user found with that ID.');
    }
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('Database query error');
  }
});

module.exports = router;
