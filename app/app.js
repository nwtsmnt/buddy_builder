const express = require("express");
const app = express();
const authRoutes = require("./routes/auth_routes");
const logoutRoutes = require("./routes/logout_routes");
const postRoutes = require("./routes/post_routes");
const aboutRoutes = require("./routes/about_routes");
const introRoutes = require("./routes/intro_routes");
const profileRoutes = require("./routes/profile_routes");
const chatRoutes = require("./routes/chat_routes")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files like CSS
app.use(express.static("./app/public"));

// Set view engine
app.set("view engine", "pug");
app.set("views", "./app/views");

// Use Routes
app.use("/auth", authRoutes);
app.use("/", logoutRoutes);
app.use("/", postRoutes);
app.use("/", aboutRoutes);
app.use("/", introRoutes);
app.use("/profile", profileRoutes);
app.use("/chat", chatRoutes);
app.use("/profile", profileRoutes);


// Start server
app.listen(3000, () => {
    console.log("Server running on http://127.0.0.1:3000");
});