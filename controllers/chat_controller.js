const db = require('../models/db');

// Fetch all users for conversations (excluding the logged-in user)
exports.getConversations = async (req, res) => {
  try {
    const userId = req.session.userId; // Logged-in user

    // Fetch all users except the logged-in user
    const users = await db.query(
      `SELECT id, name, avatar_url FROM Users WHERE id != ?`,
      [userId]
    );

    res.json(users);
  } catch (err) {
    console.error('Error fetching users for conversations:', err);
    res.status(500).send('Error fetching users for conversations.');
  }
};

// Search for users based on a query
exports.searchUsers = async (req, res) => {
  try {
    const userId = req.session.userId; // Logged-in user
    const query = req.query.query; // Search term

    // Fetch users matching the search term, excluding the logged-in user
    const users = await db.query(
      `SELECT id, name, avatar_url FROM Users 
       WHERE id != ? AND name LIKE ?`,
      [userId, `%${query}%`]
    );

    res.json(users);
  } catch (err) {
    console.error('Error searching for users:', err);
    res.status(500).send('Error searching for users.');
  }
};
