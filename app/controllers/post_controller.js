const db = require('../models/db');
const multer = require('multer');
const path = require('path');

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
    // Get success or error messages from query parameters
    const success = req.query.success || null;
    const error = req.query.error || null;
    
    // Fetch posts with user details
    const userResult = await db.query("SELECT avatar_url FROM Users WHERE id = ?", [userId]);
    const user = userResult.length ? userResult[0] : null;
    const posts = await db.query("SELECT * FROM Posts ORDER BY created_at DESC");
    const comments = await db.query("SELECT Comments.*, Users.name AS fullname FROM Comments JOIN Users ON Comments.user_id = Users.id");
    
    res.render("newsfeed", { user, posts, comments, success, error });
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

exports.addPost = async (req, res) => {
  try {
    // Add detailed debugging
    console.log("========= REQUEST BODY =========");
    console.log(req.body);
    console.log("===============================");
    
    // Check if req.body exists
    if (!req.body) {
      console.error("Request body is undefined or null");
      return res.render("add_post", { 
        error: "No form data received. Please try again.",
        formData: {} 
      });
    }
    
    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;
    const userId = req.session.userId;
    
    // Log each field separately for debugging
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("Category:", category);
    console.log("User ID:", userId);
    
    if (!userId) {
      return res.render("add_post", { 
        error: "You must be logged in to create a post.",
        formData: req.body 
      });
    }
    
    // Try direct value check rather than empty string check
    if (!title) {
      console.log("Title is falsy");
      return res.render("add_post", { 
        error: "Title cannot be empty.", 
        formData: req.body 
      });
    }
    
    if (!content) {
      console.log("Content is falsy");
      return res.render("add_post", { 
        error: "Content cannot be empty.", 
        formData: req.body 
      });
    }
    
    if (!category) {
      console.log("Category is falsy");
      return res.render("add_post", { 
        error: "Please select a category.", 
        formData: req.body 
      });
    }
    
    console.log("All validations passed, inserting post");
    
    // Insert the post into the database
    await db.query(
      "INSERT INTO Posts (title, content, category, user_id) VALUES (?, ?, ?, ?)",
      [title, content, category, userId]
    );
    
    console.log("Post inserted successfully");
    
    // Redirect to newsfeed with success message
    return res.redirect("/newsfeed?success=Post+successfully+added");
  } catch (error) {
    console.error("Error adding post:", error);
    
    return res.render("add_post", { 
      error: "An unexpected error occurred: " + error.message,
      formData: req.body
    });
  }
};