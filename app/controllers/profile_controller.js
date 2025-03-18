// controllers/profile_controller.js
const db = require('../models/db');

exports.getProfile = async (req, res) => {
  try {
    // Hardcode userId = 1 for demonstration (or use req.session.userId)
    const userId = 1;

    // 1) Fetch the user
    const result1 = await db.query('SELECT * FROM Users WHERE id = ?', [userId]);
    if (!result1.length) {
      return res.send('No user found with that ID.');
    }
    const user = result1[0];

    // 2) Fetch the user's posts (assuming table name "Posts")
    //    and that "Posts" has a column "user_id" matching the user "id"
    const result2 = await db.query('SELECT * FROM Posts WHERE user_id = ?', [userId]);

    const user2 = result2[0]
    // 3) Render profile.pug, passing both "user" and "Posts"
    //    Make sure the second parameter matches your Pug code (e.g., if your code uses "if Posts && Posts.length")
    res.render('profile', { user, user2 });

  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('Database query error');
  }
};