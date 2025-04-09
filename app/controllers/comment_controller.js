const db = require('../models/db'); // Import your DB config

exports.addComment = async (req, res) => {
    try {
        console.log('Session data:', req.session); // Debugging: Log the session data
        console.log('Request body:', req.body); // Debugging: Log the request body

        // Check if session exists
        if (!req.session) {
            return res.status(401).send('Session error: please login again.');
        }

        const { post_id, comment } = req.body;
        const user_id = req.session.userId;

        if (!user_id) {
            return res.status(401).send('You must be logged in to comment.');
        }

        if (!post_id || !comment) {
            return res.status(400).send('Post ID and comment text are required.');
        }

        // Insert the comment
        await db.query(
            'INSERT INTO Comments (post_id, user_id, comment, created_at) VALUES (?, ?, ?, NOW())',
            [post_id, user_id, comment]
        );

        // Redirect back to the newsfeed
        res.redirect('/newsfeed');
    } catch (err) {
        console.error('Error adding comment:', err.message);
        res.status(500).send('An error occurred while adding the comment.');
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.session.userId;
        
        if (!userId) {
            return res.status(401).send({ message: 'You must be logged in to delete a comment.' });
        }

        // Check if the comment belongs to the logged-in user
        const comment = await db.query('SELECT * FROM Comments WHERE id = ? AND user_id = ?', [commentId, userId]);
        if (comment.length === 0) {
            return res.status(403).send({ message: 'You are not authorized to delete this comment.' });
        }

        // Delete the comment
        const result = await db.query('DELETE FROM Comments WHERE id = ?', [commentId]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Comment not found.' });
        }
        res.status(200).send({ message: 'Comment deleted successfully.' });
    } catch (err) {
        console.error('Error deleting comment:', err.message);
        res.status(500).send({ message: 'An error occurred while deleting the comment.' });
    }
};