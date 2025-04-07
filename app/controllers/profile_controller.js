const db = require('../models/db');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.session.userId; // Use the logged-in user's ID from the session

    // Fetch the user details
    const userResult = await db.query('SELECT * FROM Users WHERE id = ?', [userId]);
    if (!userResult.length) {
      return res.status(404).send('User not found.');
    }
    const user = userResult[0];

    // Fetch the user's posts
    const postsResult = await db.query('SELECT * FROM Posts WHERE user_id = ?', [userId]);
    const posts = postsResult;

    // Fetch avatar URL for each post's author
    for (let post of posts) {
      const authorResult = await db.query('SELECT avatar_url FROM Users WHERE id = ?', [post.user_id]);
      post.author_avatar = authorResult.length ? authorResult[0].avatar_url : '/images/default-avatar.png';
    }

    // Render the profile page with user and posts data
    res.render('profile', { user, posts });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).send('Error fetching profile.');
  }
};

exports.renderProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.render("profile", { error: "User not logged in." });
    }

    const user = await db.query("SELECT * FROM Users WHERE id = ?", [userId]);
    if (!user.length) {
      return res.render("profile", { error: "User not found." });
    }

    res.render("profile", { user: user[0] });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.render("profile", { error: "An unexpected error occurred. Please try again." });
  }
};