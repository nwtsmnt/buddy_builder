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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
