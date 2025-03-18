// controllers/comment_controller.js
const db = require('../models/db'); // your DB config (mysql2/promise)

exports.addComment = async (req, res) => {
  try {
    const { post_id, fullname, comment } = req.body;
    // Insert new comment
    const sql = 'INSERT INTO Comments (post_id, fullname, comment) VALUES (?, ?, ?)';
    await db.query(sql, [post_id, fullname, comment]);

    // Redirect to newsfeed so user sees updated comments
    res.redirect('/newsfeed');
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).send('Error adding comment');
  }
};
