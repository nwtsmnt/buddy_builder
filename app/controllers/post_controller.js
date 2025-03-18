const { getPosts, getCommentsForPosts } = require("../models/post_model");

async function renderNewsfeed(req, res) {
    try {
        const posts = await getPosts();
        const comments = await getCommentsForPosts();
        
        res.render("newsfeed", { posts, comments });
    } catch (error) {
        console.error("Error fetching newsfeed:", error);
        res.status(500).send("Error fetching newsfeed.");
    }
}


module.exports = {
    renderNewsfeed
};
