const db = require('../models/db');

// Render the Edit Profile page
exports.getEditProfile = async (req, res) => {
  try {
    const userId = req.session.userId; // Use the logged-in user's ID from the session

    // Fetch the user details
    const userResult = await db.query('SELECT * FROM Users WHERE id = ?', [userId]);
    if (!userResult.length) {
      return res.status(404).send('User not found.');
    }
    const user = userResult[0];

    // Render the edit profile page with the user's current data
    res.render('edit_profile', { user });
  } catch (err) {
    console.error('Error rendering edit profile page:', err);
    res.status(500).send('Error rendering edit profile page.');
  }
};

// Handle profile updates
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { name, details, interests, skills, bio } = req.body;

    // Update the user's profile in the database
    await db.query(
      'UPDATE Users SET name = ?, details = ?, interests = ?, skills = ?, bio = ? WHERE id = ?',
      [name, details, interests, skills, bio, userId]
    );

    res.redirect('/profile'); // Redirect back to the profile page
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).send('Error updating profile.');
  }
};