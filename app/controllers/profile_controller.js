const query = require("../models/db");

// Get user profile by username
exports.getProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await query("SELECT * FROM Users WHERE username = ?", [username]);

        if (user.length === 0) {
            return res.status(404).send("User not found.");
        }

        res.render("profile", { user: user[0] });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).send("Error fetching profile.");
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const { bio, profile_picture } = req.body;

        await query("UPDATE Users SET bio = ?, profile_picture = ? WHERE username = ?", [bio, profile_picture, username]);

        res.redirect(`/profile/${username}`);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send("Error updating profile.");
    }
};
