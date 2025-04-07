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
    const success = req.query.success || null;
    
    // Fetch the current user's info
    const userResult = await db.query("SELECT * FROM Users WHERE id = ?", [userId]);
    const user = userResult.length ? userResult[0] : null;
    
    // Modified query to join Posts with Users to get author names
    const posts = await db.query(`
      SELECT p.*, u.name as author_name, u.avatar_url as author_avatar 
      FROM Posts p 
      JOIN Users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);
    
    // Format date for each post for better display
    posts.forEach(post => {
      // Convert raw date to a formatted string if it exists
      if (post.created_at) {
        const date = new Date(post.created_at);
        post.time = date.toLocaleString();
      }
    });
    
    const comments = await db.query(`
      SELECT c.*, u.name AS fullname 
      FROM Comments c
      JOIN Users u ON c.user_id = u.id
    `);
    
    res.render("newsfeed", { user, posts, comments, success });
  } catch (error) {
    console.error("Error fetching newsfeed:", error);
    res.render("newsfeed", { error: "An unexpected error occurred. Please try again." });
  }
};

exports.renderAddPost = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Fetch the user's profile picture
    const userResult = await db.query("SELECT * FROM Users WHERE id = ?", [userId]);
    const user = userResult.length ? userResult[0] : null;

    // Render the add post page with the user's profile picture
    res.render("add_post", { user, formData: {} });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.render("add_post", { error: "Error fetching user data." });
  }
};

exports.addPost = [
  upload.single('image'), // Middleware to handle file upload
  async (req, res) => {
    try {
      const { title, content, category } = req.body;
      const userId = req.session.userId;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      if (!userId || !title || !content || !category) {
        return res.render('add_post', {
          error: 'All fields are required.',
          formData: req.body,
        });
      }

      // Insert the post into the database
      await db.query(
        'INSERT INTO Posts (title, content, category, image, user_id) VALUES (?, ?, ?, ?, ?)',
        [title, content, category, image, userId]
      );

      res.redirect('/newsfeed?success=Post+successfully+added');
    } catch (error) {
      console.error('Error adding post:', error);
      res.render('add_post', {
        error: 'An unexpected error occurred.',
        formData: req.body,
      });
    }
  },
];

exports.renderProfile = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Fetch the user's profile information
    const userResult = await db.query("SELECT * FROM Users WHERE id = ?", [userId]);
    const user = userResult.length ? userResult[0] : null;

    if (!user) {
      return res.redirect('/login');
    }

    // Fetch posts created by the user
    const posts = await db.query(`
      SELECT p.*, u.avatar_url as author_avatar 
      FROM Posts p
      JOIN Users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, [userId]);

    // Render the profile page with user details and posts
    res.render('profile', { user, posts });
  } catch (error) {
    console.error('Error rendering profile:', error);
    res.render('profile', { error: 'An unexpected error occurred. Please try again.' });
  }
};