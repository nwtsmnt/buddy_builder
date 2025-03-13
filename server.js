const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Set Pug as the template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for intro page
app.get('/', (req, res) => {
    res.render('intro');
});

// Route for login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Route for signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Route for home page
app.get('/home', (req, res) => {
    const posts = [
        { title: 'Post 1', name: 'John Doe', image: '/path/to/image1.jpg', content: 'This is the content of post 1', username: 'johndoe' },
        { title: 'Post 2', name: 'Jane Smith', image: '/path/to/image2.jpg', content: 'This is the content of post 2', username: 'janesmith' },
        // Add more posts as needed
    ];
    const groups = [
        { name: 'Group 1' },
        { name: 'Group 2' },
        // Add more groups as needed
    ];
    res.render('home', { posts, groups });
});

// Route for newsfeed page
app.get('/newsfeed', (req, res) => {
    res.render('newsfeed');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
