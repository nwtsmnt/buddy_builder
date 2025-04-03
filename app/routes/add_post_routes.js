const express = require('express');
const db = require('../models/db'); // Adjust the path to your database connection
const multer = require('multer');
const path = require('path');

// Configure multer to save files with their original extensions
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Get the original file extension
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Save with a unique name and original extension
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Route to render add_post.pug
router.get("/", (req, res) => {
    res.render("add_post");
});

// Route to handle form submission
router.post("/", upload.single('attachments'), async (req, res) => {
    console.log('File uploaded:', req.file); // Log the uploaded file information
    const { title, content, category } = req.body;
    const userId = req.session.userId;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    console.log('Image path saved to database:', image); // Log the image path
    if (!userId) {
        return res.status(401).send('You must be logged in to create a post.');
    }

    if (!title || !content || !category) {
        return res.status(400).send('All fields are required.');
    }

    try {
        await db.query(
            'INSERT INTO Posts (title, content, category, image, user_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [title, content, category, image, userId]
        );
        res.status(200).send({ message: 'Post successful' });
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).send('An error occurred while creating the post.');
    }
});

module.exports = router;