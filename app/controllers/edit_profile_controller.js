const db = require('../models/db');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

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
exports.updateProfile = [
  upload.single('avatar'), // Middleware to handle file upload
  async (req, res) => {
    try {
      const userId = req.session.userId;
      const { name, details, interests, skills, bio } = req.body;
      const avatar = req.file ? `/uploads/${req.file.filename}` : null;

      // Debugging logs
      console.log('Form data received:', req.body);
      console.log('Uploaded file:', req.file);

      // Validate required fields
      if (!name) {
        throw new Error("Name is required.");
      }

      // Update the user's profile in the database
      const updateQuery = `
        UPDATE Users
        SET 
          name = ?, 
          details = ?, 
          interests = ?, 
          skills = ?, 
          bio = ?, 
          avatar_url = COALESCE(?, avatar_url)
        WHERE id = ?
      `;
      await db.query(updateQuery, [name, details, interests, skills, bio, avatar, userId]);

      console.log('Profile updated successfully.');
      res.redirect('/profile?success=Profile+updated+successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      res.render('edit_profile', {
        error: error.message || 'Error updating profile. Please try again.',
        user: req.body,
      });
    }
  },
];