const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/auth_controller");

// Render Signup Page
router.get("/signup", (req, res) => {
    res.render("signup");
});

// Route for rendering the login page
router.get("/login", (req, res) => {
    res.render("login");
  });

// Handle Signup
router.post("/signup", signup);

// Handle Login
router.post("/login", login);

module.exports = router;
