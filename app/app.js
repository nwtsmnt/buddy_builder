const express = require("express");
const app = express();
const session = require("express-session");

const authRoutes = require("./routes/auth_routes");
const logoutRoutes = require("./routes/logout_routes");
const postRoutes = require("./routes/post_routes");
const aboutRoutes = require("./routes/about_routes");
const introRoutes = require("./routes/intro_routes");
const profileRoutes = require("./routes/profile_routes");
const chatRoutes = require("./routes/chat_routes")
const addPostRoutes = require("./routes/add_post_routes");
const groupsRoutes = require("./routes/groups_routes");
const editProfileRoutes = require('./routes/edit_profile_routes');
const newsfeedRoutes = require('./routes/newsfeed_routes'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files like CSS
app.use(express.static("./app/public"));

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

// Use Routes
app.use("/auth", authRoutes);
app.use("/", logoutRoutes);
app.use("/", postRoutes);
app.use("/", aboutRoutes);
app.use("/", introRoutes);
app.use("/profile", profileRoutes);
app.use("/chat", chatRoutes);
app.use("/profile", profileRoutes);
app.use("/add_post", addPostRoutes);
app.use("/", groupsRoutes);
app.use("/", editProfileRoutes);
app.use("/", newsfeedRoutes);


// Start server
app.listen(3000, () => {
    console.log("Server running on http://127.0.0.1:3000");
});