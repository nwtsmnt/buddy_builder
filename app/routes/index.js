const express = require('express');
const router = express.Router();

// ...existing code...

// Add route for add-people page
router.get('/add-people', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('add-people');
});

// ...existing code...

module.exports = router;