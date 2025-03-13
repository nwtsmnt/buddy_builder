const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const app = express();

// Database connection configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'MySQL',
  password: '', 
  database: 'users' 
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'pug');

// Route to display the signup form
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Route to process the signup form
app.post('/signup', async (req, res) => {
  try {
    const { fullname, email, date_of_birth, password, confirm_password } = req.body;
    
    // Check if passwords match
    if (password !== confirm_password) {
      return res.status(400).send('Passwords do not match!');
    }

    // Encrypt the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert the user into the database
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'INSERT INTO users (fullname, email, password, date_of_birth) VALUES (?, ?, ?, ?)',
        [fullname, email, hashedPassword, date_of_birth]
      );
      res.redirect('/login?registered=success');
    } catch (error) {
      // Check if error is related to duplicate email
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).send('Email address already registered. Please use a different email.');
      }
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('An error occurred during registration. Please try again.');
  }
});

// Route for the login page (placeholder)
app.get('/login', (req, res) => {
  const registered = req.query.registered === 'success';
  res.render('login', { registered });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});