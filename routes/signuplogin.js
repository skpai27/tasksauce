var express = require('express');
var router = express.Router();

// GET
// Route to the Sign Up and Log In page
router.get('/', function(req, res, next) {
    res.render('signuplogin', { title: 'Welcome to TaskSauce!'});
});

module.exports = router;