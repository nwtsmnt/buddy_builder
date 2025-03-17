const { query } = require("./db");

async function getPosts() {
    return await query("SELECT Posts.*, Users.name FROM Posts JOIN Users ON Posts.user_id = Users.id ORDER BY Posts.created_at DESC");
}

async function getCommentsForPosts() {
    return await query("SELECT * FROM Comments ORDER BY created_at ASC");
}

module.exports = {
    getPosts,
    getCommentsForPosts
};
