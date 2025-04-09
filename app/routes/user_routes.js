const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Fetch all users from the database
router.get('/api/users', async (req, res) => {
    try {
        // Get the current user's ID to exclude them from the results
        const currentUserId = req.session.userId || 0;
        
        // Query to get all users except the current user
        const users = await db.query(
            'SELECT id, name, avatar_url FROM Users WHERE id != ?', 
            [currentUserId]
        );
        
        console.log('API /api/users: Found', users.length, 'users');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
