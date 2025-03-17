const { query } = require("../models/db");

async function signup(req, res) {
    try {
        const { name, email, dob, password, confirmPassword } = req.body;

        if (!name || !email || !dob || !password || !confirmPassword) {
            return res.status(400).send("All fields are required.");
        }
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match.");
        }

        await query("INSERT INTO Users (name, email, dob, password) VALUES (?, ?, ?, ?)", 
            [name, email, dob, password]);

        console.log("User signed up successfully.");
        return res.redirect("/auth/login");

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).send("Error signing up: " + error.message);
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and password are required.");
        }

        const user = await query("SELECT * FROM Users WHERE email = ? AND password = ?", 
            [email, password]);

        if (user.length === 0) {
            return res.status(400).send("Invalid email or password.");
        }

        return res.redirect("/newsfeed");
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Error logging in: " + error.message);
    }
}

module.exports = { signup, login };
