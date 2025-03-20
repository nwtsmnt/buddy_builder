const { query } = require("../models/db");

async function getProfile(req, res) {
    try {
        const userId = req.query.id; 
        if (!userId) {
            return res.status(400).send("User ID is required.");
        }

        const user = await query("SELECT * FROM Users WHERE id = ?", [userId]);

        if (user.length === 0) {
            return res.status(404).send("User not found.");
        }

        res.render("profile", { user: user[0] });
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).send(`Error loading profile: ${error.message}`);
    }
}

module.exports = { getProfile };