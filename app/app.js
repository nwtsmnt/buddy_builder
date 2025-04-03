const express = require("express");
const app = express();
const session = require("express-session");

// Apply middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./app/public"));

// Set up session BEFORE any route registrations
app.use(
    session({
        secret: "secret_key", // Replace with a strong secret key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

// Set view engine
app.set("view engine", "pug");
app.set("views", "./app/views");

// Import all routes with consistent naming
const authRoutes = require("./routes/auth_routes");
const logoutRoutes = require("./routes/logout_routes");
const postRoutes = require("./routes/post_routes");
const aboutRoutes = require("./routes/about_routes");
const introRoutes = require("./routes/intro_routes");
const profileRoutes = require("./routes/profile_routes");
const chatRoutes = require("./routes/chat_routes");
const addPostRoutes = require("./routes/add_post_routes");
const groupsRoutes = require("./routes/groups_routes");
const editProfileRoutes = require('./routes/edit_profile_routes');
const newsfeedRoutes = require('./routes/newsfeed_routes');
const addPeopleRoutes = require('./routes/add_people_routes');
const commentRoutes = require('./routes/comment_routes');

// Debug middleware to help diagnose session issues (optional)
app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session data available:', !!req.session);
    next();
});

// Register all routes AFTER session middleware
app.use("/auth", authRoutes);
app.use("/", logoutRoutes);
app.use("/", postRoutes);
app.use("/", aboutRoutes);
app.use("/", introRoutes);
app.use("/profile", profileRoutes);
app.use("/chat", chatRoutes);
app.use("/add_post", addPostRoutes);
app.use("/groups", groupsRoutes);
app.use("/", editProfileRoutes);
app.use("/newsfeed", newsfeedRoutes);
app.use("/add-people", addPeopleRoutes);
app.use('/add-comment', commentRoutes); // Register comment routes AFTER session setup
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(3000, () => {
    console.log("Server running on http://127.0.0.1:3000");
});