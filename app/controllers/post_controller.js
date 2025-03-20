const db = require('../models/db');

exports.addComment = async (req, res) => {
  try {
    const userId = req.session.userId; // Use the logged-in user's ID from the session
    const { postId, comment } = req.body;

    if (!userId || !postId || !comment) {
      return res.status(400).send('All fields are required.');
    }

    // Insert the comment into the database
    await db.query('INSERT INTO Comments (post_id, user_id, comment) VALUES (?, ?, ?)', [postId, userId, comment]);

    res.redirect('/newsfeed'); // Redirect back to the newsfeed page
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).send('Error adding comment.');
  }
};

exports.renderNewsfeed = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Fetch the user's profile picture
    const userResult = await db.query("SELECT avatar_url FROM Users WHERE id = ?", [userId]);
    const user = userResult.length ? userResult[0] : null;

    // Fetch posts and comments for the newsfeed
    const posts = await db.query("SELECT * FROM Posts ORDER BY created_at DESC"); // Ensure posts are ordered by creation time
    const comments = await db.query(`
      SELECT Comments.*, Users.name AS fullname 
      FROM Comments 
      JOIN Users ON Comments.user_id = Users.id
    `);

    // Fetch profile pictures for each post's author
    for (let post of posts) {
      const authorResult = await db.query("SELECT avatar_url FROM Users WHERE id = ?", [post.user_id]);
      post.author_avatar = authorResult.length ? authorResult[0].avatar_url : '/images/default-avatar.png';
    }

    // Render the newsfeed page with the user's profile picture, posts, and comments
    res.render("newsfeed", { user, posts, comments });
  } catch (error) {
    console.error("Error fetching newsfeed:", error);
    res.status(500).send("Error fetching newsfeed.");
  }
};

exports.renderAddPost = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Fetch the user's profile picture
    const userResult = await db.query("SELECT avatar_url FROM Users WHERE id = ?", [userId]);
    const user = userResult.length ? userResult[0] : null;

    // Render the add post page with the user's profile picture
    res.render("add_post", { user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Error fetching user data.");
  }
};