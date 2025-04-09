const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const config = require('./config/database');
const routes = require('./routes/index');
const users = require('./routes/users');
const posts = require('./routes/posts');
const chat = require('./routes/chat');
const groups = require('./routes/groups');
const about = require('./routes/about');
const addPeople = require('./routes/addPeople');
const addPost = require('./routes/addPost');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Socket.IO setup
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('sendMessage', (message) => {
        const { senderId, receiverId } = message;
        io.to(receiverId).emit('receiveMessage', { ...message, isSent: false });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Connect to MongoDB
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);
app.use('/chat', chat);
app.use('/groups', groups);
app.use('/about', about);
app.use('/add-people', addPeople);
app.use('/add_post', addPost);

// Error handling
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

server.listen(3000, '0.0.0.0', () => { // Ensure compatibility with Docker
    console.log('Server is running on port 3000');
});

const authRoutes = require("./routes/auth_routes");
const logoutRoutes = require("./routes/logout_routes");
const postRoutes = require("./routes/post_routes");
const aboutRoutes = require("./routes/about_routes");
const introRoutes = require("./routes/intro_routes");
const profileRoutes = require("./routes/profile_routes");
const addPostRoutes = require("./routes/add_post_routes");
const groupsRoutes = require("./routes/groups_routes");
const editProfileRoutes = require('./routes/edit_profile_routes');
const newsfeedRoutes = require('./routes/newsfeed_routes');
const addPeopleRoutes = require('./routes/add_people_routes');
const commentRoutes = require('./routes/comment_routes');
const chatController = require('./controllers/chat_controller'); // Import chat controller

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
app.use("/add_post", addPostRoutes);
app.use("/groups", groupsRoutes);
app.use("/", editProfileRoutes);
app.use("/newsfeed", newsfeedRoutes);
app.use("/add-people", addPeopleRoutes);
app.use('/add-comment', commentRoutes); // Register comment routes AFTER session setup
app.use('/uploads', express.static('uploads'));

// Add a route to serve the chat page
app.get("/chat", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/auth/login"); // Redirect to login if the user is not authenticated
    }

    try {
        const db = require('./models/db'); // Import the database connection
        const userId = req.session.userId;

        // Fetch the logged-in user's details
        const [user] = await db.query(
            `SELECT id, name, avatar_url FROM Users WHERE id = ?`,
            [userId]
        );

        if (!user) {
            return res.redirect("/auth/login"); // Redirect if the user is not found
        }

        res.render("chat", { userId: user.id, userName: user.name, avatarUrl: user.avatar_url });
    } catch (error) {
        console.error("Error fetching user details for chat page:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Add a route for fetching conversations
app.get("/chat/conversations", chatController.getConversations);

// Add a route for searching users
app.get("/chat/search-users", chatController.searchUsers);

// Start server
app.listen(3000, "0.0.0.0", () => { // Bind to 0.0.0.0 for Docker compatibility
    console.log("Server running on http://127.0.0.1:3000");
});