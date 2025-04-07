const { query } = require("../models/db");

async function signup(req, res) {
  try {
    const { name, email, dob, password, confirmPassword } = req.body;

    if (!name || !email || !dob || !password || !confirmPassword) {
      return res.render("signup", { error: "All fields are required." });
    }
    if (password !== confirmPassword) {
      return res.render("signup", { error: "Passwords do not match." });
    }

    await query("INSERT INTO Users (name, email, dob, password) VALUES (?, ?, ?, ?)", 
      [name, email, dob, password]);

    return res.redirect("/auth/login");
  } catch (error) {
    console.error("Signup Error:", error);
    res.render("signup", { error: "An unexpected error occurred. Please try again." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render("login", { error: "Email and password are required." });
    }

    const user = await query("SELECT * FROM Users WHERE email = ? AND password = ?", [email, password]);

    if (user.length === 0) {
      return res.render("login", { error: "Invalid email or password." });
    }

    req.session.userId = user[0].id;
    return res.redirect("/newsfeed");
  } catch (error) {
    console.error("Login Error:", error);
    res.render("login", { error: "An unexpected error occurred. Please try again." });
  }
}

module.exports = { signup, login };