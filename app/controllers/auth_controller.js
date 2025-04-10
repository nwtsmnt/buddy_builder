const { query } = require("../models/db");
const bcrypt = require("bcrypt");

// Number of salt rounds for bcrypt (higher is more secure but slower)
const SALT_ROUNDS = 10;

async function signup(req, res) {
  try {
    console.log("Signup function called with body:", req.body);
    const { name, email, dob, password, confirmPassword } = req.body;

    if (!name || !email || !dob || !password || !confirmPassword) {
      console.log("Missing required fields:", { name, email, dob, password: !!password, confirmPassword: !!confirmPassword });
      return res.render("signup", { error: "All fields are required." });
    }
    
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return res.render("signup", { error: "Passwords do not match." });
    }

    // Check if email already exists
    const existingUser = await query("SELECT * FROM Users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      console.log("Email already registered:", email);
      return res.render("signup", { error: "Email already registered." });
    }

    console.log("About to hash password:", password);
    
    // Generate a salt and hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    console.log("Generated hash:", hashedPassword);
    console.log("Hash length:", hashedPassword.length);
    
    // Additional check to ensure hash length is appropriate
    if (hashedPassword.length < 55) {
      console.error("WARNING: Generated hash seems too short:", hashedPassword.length);
    }
    
    // Log right before database insertion
    console.log("About to insert into database with hash:", hashedPassword);

    // Store user with hashed password
    await query("INSERT INTO Users (name, email, dob, password) VALUES (?, ?, ?, ?)", 
      [name, email, dob, hashedPassword]);

    // Verify that insertion worked correctly with hashed password
    const newUser = await query("SELECT * FROM Users WHERE email = ?", [email]);
    if (newUser.length > 0) {
      if (newUser[0].password.startsWith('$2b$')) {
        console.log("Verification: Password was correctly hashed!");
      } else {
        console.error("ERROR: Password was NOT correctly hashed!");
      }
    }

    console.log("Database insertion completed successfully");
    return res.redirect("/auth/login");

  } catch (error) {
    console.error("Signup Error:", error);
    res.render("signup", { error: "An unexpected error occurred. Please try again." });
  }
}

async function login(req, res) {
  try {
    console.log("Login function called with body:", req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log("Missing email or password");
      return res.render("login", { error: "Email and password are required." });
    }

    // Get user by email only (not password)
    const users = await query("SELECT * FROM Users WHERE email = ?", [email]);

    if (users.length === 0) {
      console.log("No user found with email:", email);
      return res.render("login", { error: "Invalid email or password." });
    }

    const user = users[0];
    
    // Log the stored password from DB
    console.log("User found:", user.id);
    console.log("Stored password from DB:", user.password);
    console.log("Password from form:", password);
    
    // Check if the password needs to be hashed (migration for existing users)
    if (!user.password.startsWith('$2b$')) {
      console.log("User has unhashed password - attempting to migrate");
      try {
        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        await query("UPDATE Users SET password = ? WHERE id = ?", [hashedPassword, user.id]);
        console.log("Successfully migrated user's password to hashed version");
        // Update the user object with the new hashed password
        user.password = hashedPassword;
      } catch (hashError) {
        console.error("Error hashing existing password:", hashError);
      }
    }
    
    // Compare provided password with stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    console.log("Password match result:", passwordMatch);
    
    if (!passwordMatch) {
      console.log("Password doesn't match");
      return res.render("login", { error: "Invalid email or password." });
    }

    // Store the user's ID in the session
    req.session.userId = user.id;
    console.log("User ID set in session:", req.session.userId);

    return res.redirect("/newsfeed");
  } catch (error) {
    console.error("Login Error:", error);
    res.render("login", { error: "An unexpected error occurred. Please try again." });
  }
}

module.exports = { signup, login };