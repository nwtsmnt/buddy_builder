const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Import the database connection
const chatController = require('../controllers/chat_controller'); // Import the chat controller

// Route to render chat.pug
router.get("/", async (req, res) => {
    try {
        const userId = req.session.userId;
        const receiverId = req.query.user || null; // Get receiverId from query params

        // Fetch the user's data
        const userResult = await db.query("SELECT id, name, avatar_url FROM Users WHERE id = ?", [userId]);
        const user = userResult.length ? userResult[0] : null;
        
        // Pass both user object AND userId to the template
        res.render("chat", { 
            user, 
            userId, 
            receiverId // Pass receiverId to the template
        });
    } catch (error) {
        console.error("Error rendering chat page:", error);
        res.status(500).send("Error loading chat page");
    }
});

// Route to get chat messages between two users
router.get("/messages/:userId", chatController.getMessages);

// Route to send a new message
router.post("/messages", chatController.sendMessage);

// Route to get all conversations (users)
router.get("/conversations", chatController.getConversations);

// Route to start a new conversation
router.post('/start-conversation', chatController.startConversation);

// Route to search for users
router.get('/search-users', async (req, res) => {
    try {
        const query = req.query.query;
        const userId = req.session.userId;
        
        console.log(`Searching for users matching: "${query}", current user: ${userId}`);

        // Query the database for users whose names match the search query
        const users = await db.query(
            'SELECT id, name, avatar_url FROM Users WHERE name LIKE ? AND id != ?',
            [`%${query}%`, userId]
        );
        
        // The users result is already the array we need
        console.log(`Found ${users.length} matching users`);
        res.json(users);
    } catch (err) {
        console.error('Error searching users:', err);
        res.status(500).json({ error: 'Error searching users' });
    }
});

module.exports = router;