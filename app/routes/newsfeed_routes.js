const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Import database connection

// Main newsfeed route
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;

        // Fetch the user's profile picture
        const userResult = await db.query("SELECT avatar_url FROM Users WHERE id = ?", [userId]);
        const user = userResult.length ? userResult[0] : null;

        // Fetch all posts
        const posts = await db.query(`
            SELECT 
                p.id, p.title, p.content, p.image, p.created_at,
                u.name AS author_name, u.avatar_url AS author_avatar
            FROM Posts p
            JOIN Users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `);

        // Fetch all comments
        const comments = await db.query(`
            SELECT c.id, c.post_id, c.user_id, c.comment, c.created_at, 
                   u.name AS fullname
            FROM Comments c
            JOIN Users u ON c.user_id = u.id
            ORDER BY c.created_at
        `);

        // Render the newsfeed with all posts and comments
        res.render('newsfeed', {
            user,
            posts,
            comments,
            searchQuery: '' // Empty search query for the default view
        });
    } catch (error) {
        console.error('Error loading newsfeed:', error);
        res.status(500).send('Error loading newsfeed');
    }
});

// Search route
router.get('/search', async (req, res) => {
    try {
        const query = req.query.query || ''; // Get the search query from the request
        const userId = req.session.userId;

        // Fetch the user's profile picture
        const userResult = await db.query("SELECT avatar_url FROM Users WHERE id = ?", [userId]);
        const user = userResult.length ? userResult[0] : null;

        // Fetch posts matching the search query
        let posts;
        if (!query.trim()) {
            // If search query is empty, fetch all posts
            posts = await db.query(`
                SELECT 
                    p.id, p.title, p.content, p.image, p.created_at,
                    u.name AS author_name, u.avatar_url AS author_avatar
                FROM Posts p
                JOIN Users u ON p.user_id = u.id
                ORDER BY p.created_at DESC
            `);
        } else {
            // Fetch posts matching the search query
            posts = await db.query(`
                SELECT 
                    p.id, p.title, p.content, p.image, p.created_at,
                    u.name AS author_name, u.avatar_url AS author_avatar
                FROM Posts p
                JOIN Users u ON p.user_id = u.id
                WHERE LOWER(p.title) LIKE LOWER(?)
                ORDER BY p.created_at DESC
            `, [`%${query}%`]);
        }

        // Fetch all comments
        const comments = await db.query(`
            SELECT c.id, c.post_id, c.user_id, c.comment, c.created_at, 
                   u.name AS fullname
            FROM Comments c
            JOIN Users u ON c.user_id = u.id
            ORDER BY c.created_at
        `);

        // Render the newsfeed with the filtered posts and comments
        res.render('newsfeed', {
            user,
            posts,
            comments,
            searchQuery: query // Pass the search query back to the template
        });
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).send('Error searching posts');
    }
});

module.exports = router;